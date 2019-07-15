import * as types from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  data: {
    result: []
  },
  filter: {
    page: 1,
    pageSize: 10
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.SET_RESTRICTIONS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };

    case types.GET_RESTRICTIONS:
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
    case types.ERROR_GETTING_RESTRICTIONS:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return { ...state };
  }
};
