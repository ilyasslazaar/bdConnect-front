import {
  SET_USERS_DATA,
  GET_USERS,
  CHANGE_FILTER_USERS,
  ERROR_USERS_DATA,
  EDIT_USER_ON_MODAL,
  POST_USER,
  SET_USER_ROLE,
  GET_ROLES,
  LOGIN_USER,
  GET_USER_PERMISSIONS
} from "redux/actionTypes";
import { EDIT_USERS, DELETE_USERS, ENABLE_USERS } from "../actionTypes";

export const login = (username, password, success, error) => ({
  type: LOGIN_USER,
  payload: { username, password, success, error }
});

export const setUsersData = data => ({
  type: SET_USERS_DATA,
  payload: data
});

export const getUsersData = isArchivedUsers => ({
  type: GET_USERS,
  payload: { isArchivedUsers }
});

export const getUserRoles = () => ({
  type: GET_ROLES
});

export const setUserRoles = data => ({
  type: SET_USER_ROLE,
  payload: data
});

export const errorUsersData = err => ({
  type: ERROR_USERS_DATA,
  payload: err
});

export const postUser = (user, success, error) => {
  return {
    type: POST_USER,
    payload: { user, success, error }
  };
};

export const updateUser = (user, success, error) => {
  return {
    type: EDIT_USERS,
    payload: { user, success, error }
  };
};
export const deleteUser = (userIds, success, error) => {
  return {
    type: DELETE_USERS,
    payload: { userIds, success, error }
  };
};
export const enableUser = (id, success, error) => {
  return {
    type: ENABLE_USERS,
    payload: { id, success, error }
  };
};

export const changeUsersFilter = (filter, isArchivedUsers) => ({
  type: CHANGE_FILTER_USERS,
  payload: { ...filter, isArchivedUsers }
});

export const editUserOnModal = user => ({
  type: EDIT_USER_ON_MODAL,
  payload: user
});

export const getUserPermissions = () => ({
  type: GET_USER_PERMISSIONS
});
