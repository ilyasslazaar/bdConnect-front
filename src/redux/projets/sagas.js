import { all, fork, put, takeEvery, call, select } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import { getProjetsApi, postProjetsApi, deleteProjetsApi } from "./apis";

function* getProjetsSaga() {
  try {
    const filter = yield select(state => state.appData.projets.filter);
    const response = yield call(getProjetsApi, filter.page, filter.pageSize);
    yield put({ type: types.SET_PROJETS, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_PROJETS, payload: error });
  }
}

function* postProjetsSaga({ payload }) {
  const { projets, success, error } = payload;
  try {
    const value = yield call(postProjetsApi, projets) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getProjetsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* deleteProjetsSaga({ payload }) {
  const { id, success, error } = payload;
  try {
    const value = yield call(deleteProjetsApi, id) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getProjetsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

export function* watchProjetsSaga() {
  yield takeEvery(types.GET_PROJETS, getProjetsSaga);
  yield takeEvery(types.DELETE_PROJET, deleteProjetsSaga);
  yield takeEvery(types.POST_PROJET, postProjetsSaga);
}

export default function* rootSaga() {
  yield all([fork(watchProjetsSaga)]);
}
