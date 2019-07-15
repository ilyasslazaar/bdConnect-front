import querystring from "query-string";
import instance from "util/instances";
import {
  BOXS_META_ENDPOINT,
  DOCS_META_ENDPOINT,
  PAGES_META_ENDPOINT
} from "./endpoints";

export const searchPagesMetaApi = ({ page, size, filter }) => {
  return instance.post(
    PAGES_META_ENDPOINT + "?" + querystring.stringify({ page, size }),
    filter
  );
};

export const searchDocsMetaApi = ({ page, size, filter }) => {
  return instance.post(
    DOCS_META_ENDPOINT + "?" + querystring.stringify({ page, size }),
    filter
  );
};

export const searchBoxsMetaApi = ({ page, size, filter }) => {
  return instance.post(
    BOXS_META_ENDPOINT + "?" + querystring.stringify({ page, size }),
    filter
  );
};
