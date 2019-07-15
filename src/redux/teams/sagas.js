import { all, fork, put, takeEvery, call, select } from "redux-saga/effects";

import * as types from "redux/actionTypes";

import { getTeamsApi, postTeamsApi, putTeamsApi, deleteTeams } from "./apis";

function* getTeamsSaga() {
  try {
    const filter = yield select(state => state.appData.teams.filter);

    const response = yield call(getTeamsApi, filter.page, filter.pageSize);
    yield put({ type: types.SET_TEAMS, payload: response.data });
  } catch (error) {
    yield put({ type: types.ERROR_GETTING_TEAMS, payload: error });
  }
}

function* postTeamSaga({ payload }) {
  const { team, success, error } = payload;
  try {
    const value = yield call(postTeamsApi, team) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getTeamsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* editTeamSaga({ payload }) {
  const { team, success, error } = payload;
  try {
    const value = yield call(putTeamsApi, team) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getTeamsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* deleteTeamSaga({ payload }) {
  const { id, success, error } = payload;
  try {
    const value = yield call(deleteTeams, id) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield call(getTeamsSaga);
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

export function* watchTeamssSaga() {
  yield takeEvery(types.GET_TEAMS, getTeamsSaga);
  yield takeEvery(types.DELETE_TEAM, deleteTeamSaga);
  yield takeEvery(types.EDIT_TEAM, editTeamSaga);
  yield takeEvery(types.POST_TEAM, postTeamSaga);
}

export default function* rootSaga() {
  yield all([fork(watchTeamssSaga)]);
}
