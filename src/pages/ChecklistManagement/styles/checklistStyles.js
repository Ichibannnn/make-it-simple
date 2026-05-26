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
    // color: "text.secondary",
  },
};
