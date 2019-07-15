import instance from "util/instances";
import {
  DOCS_ENDPOINT,
  DOCS_PAGES_ENDPOINT,
  DOCS_METADATA_ENDPOINT,
  VIDEO_METADATA_ENDPOINT,
  SEARCH_ENDPOINT
} from "./endpoints";

export const getDocMetadataApi = id =>
  instance.get(DOCS_ENDPOINT + id, {
    params: { id }
  });

export const getDocPagesApi = documentId =>
  instance.get(DOCS_ENDPOINT + documentId + DOCS_PAGES_ENDPOINT, {
    params: { documentId }
  });

export const updateDocMetadata = (documentId, data) => {
  return instance.put(
    DOCS_ENDPOINT +
      documentId +
      DOCS_METADATA_ENDPOINT +
      "?documentId=" +
      documentId,
    data
  );
};

export const updateVideoMetadata = (documentId, data) => {
  return instance.put(
    DOCS_ENDPOINT +
      documentId +
      VIDEO_METADATA_ENDPOINT +
      "?documentId=" +
      documentId,
    data
  );
};

export const getAutoCompleteDocs = text =>
  instance.get(DOCS_ENDPOINT + SEARCH_ENDPOINT, {
    params: { text }
  });
