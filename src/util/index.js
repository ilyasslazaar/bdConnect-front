export const transformRequestOptions = params => {
  let options = "";
  for (const key in params) {
    if (typeof params[key] !== "object") {
      options += `${key}=${params[key]}&`;
    } else if (typeof params[key] === "object" && params[key].length) {
      options += getSingleArray(params, key);
    }
  }
  return options ? options.slice(0, -1) : options;
};
