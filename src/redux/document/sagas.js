import { all, fork, put, takeEvery, call } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import {
  getDocMetadataApi,
  getDocPagesApi,
  updateDocMetadata,
  updateVideoMetadata
} from "./apis";

function* getDocMetadataSaga({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(getDocMetadataApi, id);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_DOCS_METADATA, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_DOCS_META, payload: error });
  }
}

function* getDocPagesSaga({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(getDocPagesApi, id);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_DOCS_PAGES, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_DOCS_PAGES, payload: error });
  }
}

function* updateDocMetadataSaga({ payload }) {
  const { id, isVideo, data, success, error } = payload;
  try {
    yield call(isVideo ? updateVideoMetadata : updateDocMetadata, id, data);
    if (success) success();

    yield call(getDocMetadataSaga, { payload });
  } catch (err) {
    if (error) error(err);
  }
}

export function* watchDocsSaga() {
  yield takeEvery(types.GET_DOCS_METADATA, getDocMetadataSaga);
  yield takeEvery(types.GET_DOCS_PAGES, getDocPagesSaga);
  yield takeEvery(types.UPDATE_DOCS_METADATA, updateDocMetadataSaga);
}

export default function* rootSaga() {
  yield all([fork(watchDocsSaga)]);
}
