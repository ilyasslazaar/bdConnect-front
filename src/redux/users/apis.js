import instance from "util/instances";
import {
  GET_USERS_ENDPOINT,
  USERS_ENDPOINT,
  ROLES_ENDPOINT,
  LOGIN_ENDPOINT,
  ENABLE_USER_ENDPOINT,
  /* LOGOUT_ENDPOINT,*/
  GET_ARCHIVED_USERS_ENDPOINT,
  USER_PERMISSIONS_ENDPOINT
} from "./endpoints";

export const loginApi = user => {
  let result = {};
  if (user.username !== "" && user.password !== "") {
    result = instance.post(LOGIN_ENDPOINT, {
      username: user.username,
      password: user.password
    });

    result
      .then(response => {
        const bearerToken = response.headers.authorization;
        if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
          const jwt = bearerToken.slice(7, bearerToken.length);
          localStorage.setItem("token", jwt);
          instance.defaults.headers.common["Authorization"] = "Bearer " + jwt;
        }
      })
      .catch(e => {
        const mute = e;
      });
  }

  return result;
};

export const logoutApi = () => {
  localStorage.removeItem("token");
  instance.defaults.headers.common["Authorization"] = null;
  //instance.get(LOGOUT_ENDPOINT);
};

export const getUsersApi = (isArchivedUsers, page, resultPerPage) =>
  instance.get(
    isArchivedUsers ? GET_ARCHIVED_USERS_ENDPOINT : GET_USERS_ENDPOINT,
    {
      params: { page: page - 1, size: resultPerPage }
    }
  );

export const getAutoCompleteUsers = text =>
  instance.get(USERS_ENDPOINT, {
    params: { text }
  });

export const postUser = user => {
  //console.log(user);

  const userToAdd = {
    ...user,
    authorities:
      user.role === "admin" ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"]
  };
  return instance.post(USERS_ENDPOINT, userToAdd);
};
export const getUserPermissionsApi = () =>
  instance.get(USER_PERMISSIONS_ENDPOINT);
export const putUser = user => instance.put(USERS_ENDPOINT, user);
export const deleteUserApi = userIds => {
  const params = new URLSearchParams();
  userIds.forEach(id => params.append("userIds", id));
  return instance.post(`${USERS_ENDPOINT}/delete`, userIds);
};

export const enableUser = id =>
  instance.put(ENABLE_USER_ENDPOINT.replace("{id}", id));

export const getRoleApi = () => instance.get(ROLES_ENDPOINT);
