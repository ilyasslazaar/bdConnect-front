import { get } from "lodash";
import { store } from "../App";

const INITIAL_PATH = "appData.users.userPermissions.data.userPermissions";
const permission = path => {
  get(store.getState(), INITIAL_PATH + "." + path, false);
};

export const readListAudit = () =>
  permission("auditManagementPermissions.listAuditEntries");

export const readListReporting = () =>
  permission("reportingManagementPermissions.listStatistics");

export const readListSearch = () =>
  permission("searchManagementPermissions.listSearch");

export const readProjets = () =>
  permission(
    "documentManagementPermissions.manageProjectPermissionsDto.listProjects"
  );

export const readDocs = () =>
  permission("documentManagementPermissions.manageDocuments");

export const addDocs = () =>
  permission("documentManagementPermissions.importDocuments");

export const readMissingsDocs = () =>
  permission(
    "documentManagementPermissions.manageDocumentPermissions.showMissingDocuments"
  );

export const readPagesDocs = () =>
  permission(
    "documentManagementPermissions.manageDocumentPermissions.download"
  );

export const manageUsers = () =>
  permission("userManagementPermissions.manageUsers");

export const readUsers = () =>
  permission("userManagementPermissions.manageUsersPermission.listUsers");

export const readArchivedUsers = () =>
  permission(
    "userManagementPermissions.manageUsersPermission.listArchivedUsers"
  );
export const readTeams = () =>
  permission("userManagementPermissions.manageTeamPermission.listTeams");
export const manageRestrictions = () =>
  permission("userManagementPermissions.manageRestrictions");
