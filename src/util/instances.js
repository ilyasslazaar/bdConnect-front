import axios from "axios";
const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/",
  timeout: 150000
});
instance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");
export default instance;
