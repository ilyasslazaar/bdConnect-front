import * as types from "redux/actionTypes";

export const getBoxs = () => ({
  type: types.GET_BOXS
});

export const getBoxMetadata = id => ({
  type: types.GET_BOX_METADATA,
  payload: { id }
});

export const updateBoxMetadata = (id, data, success, error) => ({
  type: types.UPDATE_BOX_METADATA,
  payload: { id, data, success, error }
});

export const getBoxDocs = id => ({
  type: types.GET_BOX_DOCS,
  payload: { id }
});

export const getMissingsPages = (project, box, document, page) => ({
  type: types.MISSINGS_PAGES,
  payload: { project, box, document, page }
});
