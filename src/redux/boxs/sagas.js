import { all, fork, put, takeEvery, call } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import {
  getBoxsApi,
  getBoxMetadataApi,
  getBoxDocsApi,
  updateBoxMetadata,
  getMissingsPagesApi
} from "./apis";

function* getBoxsSaga() {
  try {
    const response = yield call(getBoxsApi);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_BOXS, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_BOXS, payload: error });
  }
}

function* getBoxMetadataSaga({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(getBoxMetadataApi, id);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_BOX_METADATA, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_BOX_META, payload: error });
  }
}

function* getBoxDocsSaga({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(getBoxDocsApi, id);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_BOX_DOCS, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_BOX_DOCS, payload: error });
  }
}

function* updateBoxMetadataSaga({ payload }) {
  const { id, data, success, error } = payload;
  try {
    yield call(updateBoxMetadata, id, data);
    if (success) success();

    yield call(getBoxMetadataSaga, { payload });
  } catch (err) {
    if (error) error(err);
  }
}

function* getMissingsPagesSaga({ payload }) {
  const { project, box, document, page } = payload;
  try {
    const response = yield call(
      getMissingsPagesApi,
      project,
      box,
      document,
      page
    );
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    yield put({ type: types.SET_MISSINGS_PAGES, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_MISSINGS_PAGES, payload: error });
  }
}

export function* watchBoxsSaga() {
  yield takeEvery(types.GET_BOXS, getBoxsSaga);
  yield takeEvery(types.GET_BOX_METADATA, getBoxMetadataSaga);
  yield takeEvery(types.GET_BOX_DOCS, getBoxDocsSaga);
  yield takeEvery(types.UPDATE_BOX_METADATA, updateBoxMetadataSaga);
  yield takeEvery(types.MISSINGS_PAGES, getMissingsPagesSaga);
}

export default function* rootSaga() {
  yield all([fork(watchBoxsSaga)]);
}
