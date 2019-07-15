import * as types from "redux/actionTypes";

export const getDocsMetadata = id => ({
  type: types.GET_DOCS_METADATA,
  payload: { id }
});

export const updateDocsMetadata = (id, data, success, error, isVideo) => ({
  type: types.UPDATE_DOCS_METADATA,
  payload: { id, isVideo, data, success, error }
});

export const getDocsPages = id => ({
  type: types.GET_DOCS_PAGES,
  payload: { id }
});
