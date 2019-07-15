import * as types from "redux/actionTypes";

export const getProjets = filter => ({
  type: types.GET_PROJETS,
  payload: { ...filter }
});

export const postProjets = (projets, success, error) => {
  return {
    type: types.POST_PROJET,
    payload: { projets, success, error }
  };
};

export const deleteProjets = (id, success, error) => {
  return {
    type: types.DELETE_PROJET,
    payload: { id, success, error }
  };
};
