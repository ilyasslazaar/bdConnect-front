import * as types from "redux/actionTypes";

export const getRestrictions = filter => ({
  type: types.GET_RESTRICTIONS,
  payload: { ...filter }
});

export const postRestrictions = (restrictions, success, error) => {
  return {
    type: types.POST_RESTRICTION,
    payload: { restrictions, success, error }
  };
};

export const deleteRestrictions = (id, success, error) => {
  return {
    type: types.DELETE_RESTRICTION,
    payload: { id, success, error }
  };
};
