module.exports = [
  {
    id: "home",
    textId: "menu.app",
    icon: "iconsmind-Home"
  },
  {
    id: "users",
    textId: "menu.users",
    icon: "iconsmind-User",
    hasAccess: "manageUsers",
    child: [
      {
        id: "list",
        textId: "user.Manage-Uses",
        icon: "simple-icon-user",
        hasAccess: "readUsers"
      },
      {
        id: "archived",
        textId: "user.Archived-Users",
        icon: "simple-icon-user-unfollow",
        hasAccess: "readArchivedUsers"
      },
      {
        id: "teams",
        textId: "user.Manage-Teams",
        icon: "simple-icon-people",
        hasAccess: "readTeams"
      },
      {
        id: "restrictions",
        textId: "menu.restrictions",
        icon: "simple-icon-lock",
        hasAccess: "manageRestrictions"
      }
    ]
  },
  {
    id: "documents",
    textId: "menu.documents",
    icon: "iconsmind-Folder-WithDocument",
    hasAccess: "readDocs",
    child: [
      {
        id: "list",
        textId: "doc.list-document",
        icon: "simple-icon-docs",
        hasAccess: "readDocs"
      },
      {
        id: "projets",
        textId: "doc.list-projets",
        icon: "simple-icon-briefcase",
        hasAccess: "readProjets"
      },
      {
        id: "importDoc",
        textId: "doc.import-documents",
        icon: "simple-icon-doc",
        hasAccess: "addDocs"
      },
      {
        id: "ocr",
        textId: "doc.import-ocr",
        icon: "simple-icon-eye",
        hasAccess: "addDocs"
      }
      // {
      //   id: "metadata",
      //   textId: "doc.import-metadata",
      //   icon: "simple-icon-note"
      // }
    ]
  },
  {
    id: "search",
    textId: "menu.search",
    icon: "simple-icon-docs",
    hasAccess: "readListSearch"
  },
  {
    id: "audit",
    textId: "menu.audit",
    icon: "iconsmind-Bar-Chart",
    hasAccess: "readListAudit"
  },
  {
    id: "reporting",
    textId: "menu.reporting",
    icon: "iconsmind-Dashboard",
    hasAccess: "readListReporting"
  }
];
