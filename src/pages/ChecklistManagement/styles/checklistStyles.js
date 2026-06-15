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

  checklistDialog: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 0,
    paddingBottom: 0,
    marginBlockEnd: "5.28px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#48BB78",
  },

  checklistDialogContent: {
    mt: 4,
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },

  checklistDialogHeader: {
    width: "65%",
    flexDirection: "row",
  },

  checklistHeaderText: {
    fontSize: "20px",
    fontWeight: 600,
    margin: 0,
    letterSpacing: -0.5,
  },

  arrowButton: {
    fontSize: "26px",
  },

  checklistBodyContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },

  checklistSectionsContainer: {
    width: "65%",
    height: "auto",
    bgcolor: "#1D293D",
    mt: 2,
    borderRadius: "12px",
    border: "1px solid #4b586f",
    flexDirection: "row",
  },

  checklistSectionContent: {
    width: "100%",
    p: 2,
  },

  boxStyling: {
    height: "100%",
    width: "20px",
    backgroundColor: "#6E53A5",
  },

  checklistSectionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  checklistFormDescription: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0.2,
  },

  dotIcon: {
    fontSize: "10px",
  },

  checklistFormText: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: 1,
    color: "#EDF2F7",
  },

  inputProps: {
    style: {
      fontSize: "14px",
    },
  },

  inputLabelProps: {
    style: {
      fontSize: "14px",
    },
  },

  checklistSectionsContent: {
    mt: 2,
    bgcolor: "#1C2536",
    borderRadius: "12px",
    border: "1px solid #4b586f",
    padding: 2,
  },

  sectionChipStyle: {
    fontWeight: 500,
    fontSize: "11px",
    height: 20,
    width: "fit-content",
    borderRadius: "4px",
    alignItems: "center",
    color: "#ffffffde",
    marginBottom: "8px",
  },

  sectionTextField: {
    width: "100%",
    flexDirection: "row",
    gap: 1,
  },

  sectionIconButton: {
    border: "1px solid #4b586f",
    borderRadius: "4px",
    padding: "4px",
  },
  checklistFormActions: {
    mt: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    // gap: 2,
    width: "100%",
  },
  addQuestionButton: {
    mt: 4,
    fontSize: "11px",
    padding: "6px 16px",
  },
};
