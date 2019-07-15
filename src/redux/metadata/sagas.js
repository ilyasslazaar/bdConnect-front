import { all, fork, takeEvery, call } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import {
  searchPagesMetaApi,
  searchDocsMetaApi,
  searchBoxsMetaApi
} from "./apis";
import { logger } from "util/Logger";

function* searchPageSaga({ payload }) {
  const { success } = payload;
  try {
    const response = yield call(searchPagesMetaApi, payload);
    if (response.status !== 200) {
      throw new Error("Error !");
    }
    if (success) success(response.data);
  } catch (err) {
    logger("error searching by Metadata");
  }
}

function* searchDocsSaga({ payload }) {
  const { success } = payload;
  try {
    const response = yield call(searchDocsMetaApi, payload);
    if (response.status !== 200) {
      throw new Error("Error !");
    }
    if (success) success(response.data);
  } catch (err) {
    logger("error searching by Metadata");
  }
}

function* searchBoxsSaga({ payload }) {
  const { success } = payload;
  try {
    const response = yield call(searchBoxsMetaApi, payload);
    if (response.status !== 200) {
      throw new Error("Error !");
    }
    if (success) success(response.data);
  } catch (err) {
    logger("error searching by Metadata");
  }
}

export function* watchBoxsSaga() {
  yield takeEvery(types.BOX_WITHOUT_META, searchBoxsSaga);
  yield takeEvery(types.DOC_WITHOUT_META, searchDocsSaga);
  yield takeEvery(types.PAGE_WITHOUT_META, searchPageSaga);
}

export default function* rootSaga() {
  yield all([fork(watchBoxsSaga)]);
}
