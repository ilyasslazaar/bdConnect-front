import instance from "util/instances";
import { RESTRICTIONS_ENDPOINT } from "./endpoints";

export const getRestrictionsApi = (page, resultPerPage) =>
  instance.get(RESTRICTIONS_ENDPOINT, {
    params: { page, resultPerPage }
  });

export const postRestrictionsApi = restrictions =>
  instance.post(RESTRICTIONS_ENDPOINT, restrictions);

export const deleteRestrictionsApi = restrictionsIds => {
  const params = new URLSearchParams();
  restrictionsIds.forEach(id => params.append("ids", id));
  return instance.delete(`${RESTRICTIONS_ENDPOINT}`, { params });
};
