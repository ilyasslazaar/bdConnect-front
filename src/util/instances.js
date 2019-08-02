import axios from "axios";
import { servicePath } from "../constants/defaultValues";
const instance = axios.create({
  baseURL: servicePath,
  timeout: 150000
});
instance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");
export default instance;
