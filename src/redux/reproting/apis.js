import instance from "util/instances";
import { REPORTING_ENDPOINT } from "./endpoints";

export const getReportingData = () => instance.put(REPORTING_ENDPOINT);
