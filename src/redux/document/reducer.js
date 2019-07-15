import * as types from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  metadata: {},
  pages: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.SET_DOCS_PAGES:
      return {
        ...state,
        pages: action.payload,
        loading: false
      };

    case types.GET_DOCS_PAGES:
    case types.GET_DOCS_METADATA:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case types.ERROR_GETTING_DOCS_PAGES:
    case types.ERROR_GETTING_DOCS_META:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.SET_DOCS_METADATA:
      return {
        ...state,
        metadata: action.payload,
        loading: false
      };
    default:
      return { ...state };
  }
};
