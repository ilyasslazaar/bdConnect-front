import instance from "util/instances";
import { TEAMS_ENDPOINT } from "./endpoints";

export const getTeamsApi = (page, resultPerPage) =>
  instance.get(TEAMS_ENDPOINT, {
    params: { page, resultPerPage }
  });
export const getAutoCompleteTeams = text =>
  instance.get(TEAMS_ENDPOINT, {
    params: { text, page: 1, resultPerPage: 10 }
  });

export const postTeamsApi = team => instance.post(TEAMS_ENDPOINT, team);
export const putTeamsApi = team => instance.put(TEAMS_ENDPOINT, team);
export const deleteTeams = teamIds => {
  const params = new URLSearchParams();
  teamIds.forEach(id => params.append("teamIds", id));
  return instance.delete(`${TEAMS_ENDPOINT}`, { params });
};
