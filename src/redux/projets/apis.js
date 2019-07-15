import instance from "util/instances";
import { PROJETS_ENDPOINT } from "./endpoints";

export const getProjetsApi = (page, resultPerPage) =>
  instance.get(PROJETS_ENDPOINT, {
    params: { page, resultPerPage }
  });

export const postProjetsApi = projets =>
  instance.post(PROJETS_ENDPOINT, projets);

export const deleteProjetsApi = id =>
  instance.delete(`${PROJETS_ENDPOINT}${id}`);
