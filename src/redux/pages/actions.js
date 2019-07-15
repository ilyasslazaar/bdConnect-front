import * as types from "redux/actionTypes";

export const getPageMetadata = id => ({
  type: types.GET_PAGE_METADATA,
  payload: { id }
});

export const updatePageMetadata = (id, data, success, error) => ({
  type: types.UPDATE_PAGE_METADATA,
  payload: { id, data, success, error }
});

export const uploadPage = (
  document,
  onUploadProgress,
  success,
  error,
  cancelToken,
  isOCR = false
) => ({
  type: types.UPLOAD_PAGE,
  payload: {
    data: { document },
    onUploadProgress,
    success,
    error,
    cancelToken,
    isOCR
  }
});

export const downloadPage = (id, success) => ({
  type: types.DOWNLOAD_PAGE,
  payload: { id, success }
});

export const searchPage = data => ({
  type: types.SEARCH_PAGE,
  payload: data
});

export const auditSearch = data => ({
  type: types.AUDIT_SEARCH,
  payload: data
});
