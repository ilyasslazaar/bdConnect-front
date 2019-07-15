import { all, fork, put, takeEvery, call, select } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import {
  getPageMetadataApi,
  updatePageMetadataApi,
  uploadPageApi,
  downloadPageApi,
  searchPagesApi,
  auditSearchApi
} from "./apis";

function* getPageMetadataSaga({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(getPageMetadataApi, id);
    yield put({ type: types.SET_PAGE_METADATA, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_PAGE_META, payload: error });
  }
}

function* updatePageMetadataSaga({ payload }) {
  const { id, data, success, error } = payload;
  try {
    yield call(updatePageMetadataApi, id, data);
    if (success) success();

    yield call(getPageMetadataSaga, { payload });
  } catch (err) {
    if (error) error(err);
  }
}

function* downloadPageSaga({ payload }) {
  const { id, success, error } = payload;
  try {
    const response = yield call(downloadPageApi, id);
    const contentDisposition = response.headers[
      "content-disposition"
    ].toLowerCase();
    let type = "";
    if (contentDisposition.includes(".pdf")) {
      type = "application/pdf";
    }

    const file = new Blob([response.data], { type });

    const fileURL = URL.createObjectURL(file);

    if (success) success(fileURL, type);
  } catch (err) {
    if (error) error(err);
  }
}

function* uploadPageSaga({ payload }) {
  const {
    data,
    success,
    error,
    onUploadProgress,
    cancelToken,
    isOCR
  } = payload;
  try {
    const response = yield call(
      uploadPageApi,
      data,
      onUploadProgress,
      cancelToken,
      isOCR
    );
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    if (success) success(response);
  } catch (err) {
    if (error) error(err.message);
  }
}

function* searchPageSaga() {
  try {
    const filter = yield select(state => state.appData.pages.filterSearch);
    const response = yield call(searchPagesApi, filter);
    if (response.status !== 200) {
      throw new Error("Error !");
    }
    yield put({ type: types.SET_SEARCH_PAGE, payload: response.data });
  } catch (err) {
    yield put({ type: types.ERROR_GETTING_SEARCH_PAGE, payload: err });
  }
}

function* auditSearchSaga() {
  try {
    const filter = yield select(state => state.appData.pages.filterAudit);
    const response = yield call(auditSearchApi, filter);
    if (response.status !== 200) {
      throw new Error("Error !");
    }
    yield put({ type: types.SET_AUDIT_SEARCH, payload: response.data });
  } catch (err) {
    yield put({ type: types.ERROR_AUDIT_SEARCH, payload: err });
  }
}

export function* watchPagesSaga() {
  yield takeEvery(types.UPDATE_PAGE_METADATA, updatePageMetadataSaga);
  yield takeEvery(types.GET_PAGE_METADATA, getPageMetadataSaga);
  yield takeEvery(types.DOWNLOAD_PAGE, downloadPageSaga);
  yield takeEvery(types.UPLOAD_PAGE, uploadPageSaga);
  yield takeEvery(types.SEARCH_PAGE, searchPageSaga);
  yield takeEvery(types.AUDIT_SEARCH, auditSearchSaga);
}

export default function* rootSaga() {
  yield all([fork(watchPagesSaga)]);
}
