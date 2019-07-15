import * as types from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  metadata: {},
  docs: [],
  data: {
    result: {
      videos: [],
      documents: []
    }
  },
  missingsPages: {
    data: {},
    loading: false,
    error: undefined
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.SET_BOXS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };

    case types.GET_BOXS:
    case types.GET_BOX_METADATA:
    case types.GET_BOX_DOCS:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case types.ERROR_GETTING_BOXS:
    case types.ERROR_GETTING_BOX_META:
    case types.ERROR_GETTING_BOX_DOCS:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.SET_BOX_DOCS:
      return {
        ...state,
        docs: action.payload,
        loading: false
      };
    case types.SET_BOX_METADATA:
      return {
        ...state,
        metadata: action.payload,
        loading: false
      };
    case types.MISSINGS_PAGES:
      return {
        ...state,
        missingsPages: {
          loading: true,
          error: undefined,
          data: {}
        }
      };
    case types.SET_MISSINGS_PAGES:
      return {
        ...state,
        missingsPages: {
          loading: false,
          error: undefined,
          data: action.payload
        }
      };
    case types.ERROR_MISSINGS_PAGES:
      return {
        ...state,
        missingsPages: { loading: false, error: action.payload, data: {} }
      };
    default:
      return { ...state };
  }
};
