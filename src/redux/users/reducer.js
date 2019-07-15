import {
  SET_USERS_DATA,
  GET_USERS,
  ERROR_USERS_DATA,
  CHANGE_FILTER_USERS,
  EDIT_USER_ON_MODAL,
  SET_USER_ROLE,
  SET_USER_PERMISSIONS,
  GET_USER_PERMISSIONS
} from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  roles: [],
  data: {
    result: []
  },
  editedUser: {},
  filter: {
    page: 1,
    pageSize: 10,
    orderBy: undefined
  },
  userPermissions: {
    loading: true,
    data: {},
    error: undefined
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USERS_DATA:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    case SET_USER_ROLE:
      return {
        ...state,
        roles: action.payload
      };

    case GET_USERS:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case ERROR_USERS_DATA:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case CHANGE_FILTER_USERS:
      return {
        ...state,
        filter: action.payload,
        loading: true,
        error: undefined
      };
    case EDIT_USER_ON_MODAL:
      return { ...state, editedUser: action.payload };
    case GET_USER_PERMISSIONS:
      return {
        ...state,
        userPermissions: {
          loading: true,
          data: {},
          error: undefined
        }
      };
    case SET_USER_PERMISSIONS:
      return {
        ...state,
        userPermissions: {
          loading: false,
          data: action.payload,
          error: undefined
        }
      };
    default:
      return { ...state };
  }
};
