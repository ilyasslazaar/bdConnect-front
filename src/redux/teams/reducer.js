import * as types from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  data: {
    result: []
  },
  editedTeam: {},
  filter: {
    page: 1,
    pageSize: 10
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.SET_TEAMS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };

    case types.GET_TEAMS:
      return {
        ...state,
        loading: true,
        filter: action.payload.page
          ? action.payload
          : {
              page: 1,
              pageSize: 10
            },
        error: undefined
      };
    case types.ERROR_GETTING_TEAMS:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.EDIT_TEAM_ON_MODAL:
      return { ...state, editedTeam: action.payload };
    default:
      return { ...state };
  }
};
