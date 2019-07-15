import instance from "util/instances";
import {
  BOXS_DOCUMENTS_ENDPOINT,
  BOXS_ENDPOINT,
  BOXS_METADATA_ENDPOINT,
  BOXS_AUTOCOMPLETE,
  BOXS_GROUPS_ENDPOINT,
  MISSINGS_DOCS
} from "./endpoints";

export const getBoxsApi = () =>
  instance.get(BOXS_ENDPOINT + BOXS_GROUPS_ENDPOINT, {
    params: { intervalSize: 100 }
  });

export const getBoxMetadataApi = id =>
  instance.get(BOXS_ENDPOINT + id, {
    params: { id }
  });

export const getBoxDocsApi = boxId =>
  instance.get(BOXS_ENDPOINT + boxId + BOXS_DOCUMENTS_ENDPOINT, {
    params: { boxId }
  });

export const getAutoCompleteBox = text =>
  instance.get(BOXS_ENDPOINT + BOXS_AUTOCOMPLETE, {
    params: { text }
  });

export const updateBoxMetadata = (boxId, data) => {
  return instance.put(
    BOXS_ENDPOINT + boxId + BOXS_METADATA_ENDPOINT + "?boxId=" + boxId,
    data
  );
};

export const getMissingsPagesApi = (project, box, document, page) =>
  instance.get(MISSINGS_DOCS, {
    params: { project, box, document, page }
  });
