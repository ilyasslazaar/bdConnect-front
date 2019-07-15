import { get } from "lodash";
import {
  all,
  fork,
  put,
  takeEvery,
  call,
  select,
  takeLatest
} from "redux-saga/effects";

import {
  GET_USERS,
  CHANGE_FILTER_USERS,
  POST_USER,
  SET_USER_PERMISSIONS
} from "redux/actionTypes";

import {
  setUsersData,
  errorUsersData,
  setUserRoles,
  getUsersData
} from "./actions";

import {
  getUsersApi,
  postUser,
  getRoleApi,
  loginApi,
  putUser,
  deleteUserApi,
  enableUser,
  getUserPermissionsApi
} from "./apis";
import {
  GET_ROLES,
  LOGIN_USER,
  EDIT_USERS,
  DELETE_USERS,
  ENABLE_USERS,
  GET_USER_PERMISSIONS
} from "../actionTypes";
import { logger } from "util/Logger";

function* loginSaga({ payload }) {
  const { username, password, success, error } = payload;
  try {
    const value = yield call(loginApi, { username, password }) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* getUsersSaga({ payload }) {
  try {
    const filter = yield select(state => state.appData.users.filter);
    const response = yield call(
      getUsersApi,
      payload.isArchivedUsers,
      filter.page,
      filter.pageSize
    );
    yield put(setUsersData(response.data));
  } catch (error) {
    yield put(errorUsersData(error));
  }
}

function* postUserSaga({ payload }) {
  const { user, success, error } = payload;
  try {
    const value = yield call(postUser, user) || {};
    if ([200, 201].includes(value.status)) {
      yield put(getUsersData());
      if (success) success();
    } else {

      if (error) error(get(value, "data.message"));
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* editUserSaga({ payload }) {
  const { user, success, error } = payload;
  try {
    const value = yield call(putUser, user) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield put(getUsersData());
    } else {
      if (error) error(get(value, "data.message"));
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* deleteUserSaga({ payload }) {
  const { userIds, success, error } = payload;
  try {
    const value = yield call(deleteUserApi, userIds);
    yield put(getUsersData());

    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield put(getUsersData());
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}
function* enableUserSaga({ payload }) {
  const { id, success, error } = payload;
  try {
    const value = yield call(enableUser, id) || {};
    if ([200, 201].includes(value.status)) {
      if (success) success();
      yield put(getUsersData());
    } else {
      if (error) error();
    }
  } catch (err) {
    if (error) error(err);
  }
}

function* getRolesSaga() {
  try {
    const response = yield call(getRoleApi);
    yield put(setUserRoles(response.data));
  } catch (error) {
    logger("Error gettings roles");
  }
}

function* getUserPermissionsSaga() {
  try {
    const response = yield call(getUserPermissionsApi);
    yield put({ type: SET_USER_PERMISSIONS, payload: response.data });
  } catch (error) {
    yield put(errorUsersData(error));
  }
}

export function* watchUsersSaga() {
  yield takeEvery(GET_USERS, getUsersSaga);
  yield takeEvery(CHANGE_FILTER_USERS, getUsersSaga);
  yield takeEvery(POST_USER, postUserSaga);
  yield takeEvery(LOGIN_USER, loginSaga);
  yield takeEvery(EDIT_USERS, editUserSaga);
  yield takeEvery(DELETE_USERS, deleteUserSaga);
  yield takeEvery(ENABLE_USERS, enableUserSaga);
  yield takeEvery(GET_USER_PERMISSIONS, getUserPermissionsSaga);
}

export function* watchGetRoles() {
  yield takeLatest(GET_ROLES, getRolesSaga);
}

export default function* rootSaga() {
  yield all([fork(watchUsersSaga), fork(watchGetRoles)]);
}
