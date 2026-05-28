export const checklistStyles = {
  customSearch: {
    fontWeight: 400,
    lineHeight: "1.4375rem",
    borderRadius: "3px",
    fontSize: "13px",
    width: "30%",
  },

  icons: {
    fontSize: "30px",
  },

  componentContainer: {
    mt: 4,
    width: "100%",
  },

  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  cardContainer: {
    position: "relative",
    "&:hover": { borderColor: "primary.main", cursor: "pointer" },
    borderRadius: 2,
  },

  createCard: {
    height: "100%",
    minHeight: 280,
    width: "100%",
    borderRadius: 2,
    borderStyle: "dashed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
  },

  folderCards: {
    width: "100%",
    height: "100%",
    bgcolor: "#111c2d",
    borderRadius: 2,
    p: 2,
  },

  createAddIcon: {
    fontSize: 44,
    color: "text.secordary",
    mb: 1,
  },

  createNewFormText: {
    color: "text.secondary",
    display: "block",
    fontWeight: 500,
    letterSpacing: 0.5,
  },

  cardTitle: {
    fontWeight: 700,
    color: "primary.main",
  },

  cardDescription: {
    fontSize: "12px",
  },

  cardDetails: {
    fontSize: "12px",
    color: "text.secondary",
  },

  // Checklist Dialog
  checklistDialogContent: {
    mt: 1,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },

  checklistDialogHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  checklistHeaderText: {
    fontSize: "24px",
    fontWeight: 600,
    margin: 0,
  },

  arrowButton: {
    fontSize: "26px",
  },

  checklistBodyContainer: {
    width: "100%",
    height: "100%",
    mt: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  checklistSectionsContainer: {
    width: "40%",
    height: "50%",
    bgcolor: "#111c2d",
  },
};
