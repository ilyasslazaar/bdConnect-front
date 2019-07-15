import * as types from "redux/actionTypes";

export const getTeams = filter => ({
  type: types.GET_TEAMS,
  payload: { ...filter }
});

export const postTeam = (team, success, error) => {
  return {
    type: types.POST_TEAM,
    payload: { team, success, error }
  };
};

export const updateTeam = (team, success, error) => {
  return {
    type: types.EDIT_TEAM,
    payload: { team, success, error }
  };
};
export const deleteTeam = (id, success, error) => {
  return {
    type: types.DELETE_TEAM,
    payload: { id, success, error }
  };
};

export const editTeamOnModal = user => ({
  type: types.EDIT_TEAM_ON_MODAL,
  payload: user
});
