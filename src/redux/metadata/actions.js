import * as types from "redux/actionTypes";

export const searchBoxMetadata = (filter, page, size, success) => ({
  type: types.BOX_WITHOUT_META,
  payload: { filter, page, size, success }
});

export const searchDocMetadata = (filter, page, size, success) => ({
  type: types.DOC_WITHOUT_META,
  payload: { filter, page, size, success }
});

export const searchPageMetadata = (filter, page, size, success) => ({
  type: types.PAGE_WITHOUT_META,
  payload: { filter, page, size, success }
});
