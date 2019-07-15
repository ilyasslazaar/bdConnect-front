import querystring from "query-string";
import instance from "util/instances";
import {
  PAGES_ENDPOINT,
  PAGES_DOWNLOAD_ENDPOINT,
  PAGES_METADATA_ENDPOINT,
  PAGES_SEARCH_ENDPOINT,
  AUDIT_SEARCH_ENDPOINT,
  OCR_ENDPOINT
} from "./endpoints";

export const getPageMetadataApi = id =>
  instance.get(PAGES_ENDPOINT + "{id}", {
    params: { id }
  });

export const uploadPageApi = (data, onUploadProgress, cancelToken, isOCR) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return instance.put(isOCR ? OCR_ENDPOINT : PAGES_ENDPOINT, formData, {
    onUploadProgress,
    cancelToken
  });
};

export const updatePageMetadataApi = (pageId, data) => {
  return instance.put(
    PAGES_ENDPOINT + pageId + PAGES_METADATA_ENDPOINT + "?pageId=" + pageId,
    data
  );
};

export const downloadPageApi = pageId =>
  instance.get(PAGES_ENDPOINT + pageId + PAGES_DOWNLOAD_ENDPOINT, {
    params: { pageId },
    responseType: "blob"
  });

export const searchPagesApi = ({
  page,
  resultPerPage,
  searchType,
  ...data
}) => {
  return instance.post(
    PAGES_SEARCH_ENDPOINT +
      "?" +
      querystring.stringify({ page, resultPerPage, searchType }),
    data
  );
};

export const auditSearchApi = ({ page, resultPerPage, ...data }) => {
  return instance.post(
    AUDIT_SEARCH_ENDPOINT +
      "?" +
      querystring.stringify({ page, resultPerPage }),
    data
  );
};
