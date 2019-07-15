import { all, fork, put, takeEvery, call, select } from "redux-saga/effects";

import * as types from "redux/actionTypes";
import {
  getRestrictionsApi,
  postRestrictionsApi,
  deleteRestrictionsApi
} from "./apis";

function* getRestrictionsSaga() {
  try {
    const filter = yield select(state => state.appData.restrictions.filter);
    const response = yield call(
      getRestrictionsApi,
      filter.page,
      filter.pageSize
    );
    yield put({ type: types.SET_RESTRICTIONS, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_RESTRICTIONS, payload: error });
  }
}

function* postRestrictionsSaga({ payload }) {
  const { restrictions, success, error } = payload;
  try {
    const value = yield call(postRestrictionsApi, restrictions) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getRestrictionsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* deleteRestrictionsSaga({ payload }) {
  const { id, success, error } = payload;
  try {
    const value = yield call(deleteRestrictionsApi, id) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getRestrictionsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

export function* watchRestrictionsSaga() {
  yield takeEvery(types.GET_RESTRICTIONS, getRestrictionsSaga);
  yield takeEvery(types.DELETE_RESTRICTION, deleteRestrictionsSaga);
  yield takeEvery(types.POST_RESTRICTION, postRestrictionsSaga);
}

export default function* rootSaga() {
  yield all([fork(watchRestrictionsSaga)]);
}
