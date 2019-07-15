import * as types from "redux/actionTypes";

const INIT_STATE = {
  loading: false,
  metadata: {},
  search: {
    data: {
      result: []
    },
    loading: false,
    error: undefined
  },
  filterSearch: {
    page: 1,
    resultPerPage: 10
  },
  audit: {
    data: {
      result: []
    },
    loading: false,
    error: undefined
  },
  filterAudit: {
    page: 1,
    resultPerPage: 10
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.AUDIT_SEARCH:
      return {
        ...state,
        filterAudit: action.payload,
        audit: {
          data: {
            result: []
          },
          loading: true,
          error: undefined
        }
      };
    case types.SET_AUDIT_SEARCH:
      return {
        ...state,
        audit: { data: action.payload, loading: false, error: undefined }
      };
    case types.ERROR_AUDIT_SEARCH:
      return {
        ...state,
        audit: {
          error: action.payload,
          loading: false,
          data: {
            result: []
          }
        }
      };
    case types.SEARCH_PAGE:
      return {
        ...state,
        filterSearch: action.payload,
        search: {
          data: {
            result: []
          },
          loading: true,
          error: undefined
        }
      };
    case types.SET_SEARCH_PAGE:
      return {
        ...state,
        search: { data: action.payload, loading: false, error: undefined }
      };
    case types.ERROR_GETTING_SEARCH_PAGE:
      return {
        ...state,
        search: {
          error: action.payload,
          loading: false,
          data: {
            result: []
          }
        }
      };
    case types.GET_PAGE_METADATA:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case types.ERROR_GETTING_PAGE_META:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.SET_PAGE_METADATA:
      return {
        ...state,
        metadata: action.payload,
        loading: false
      };
    default:
      return { ...state };
  }
};
