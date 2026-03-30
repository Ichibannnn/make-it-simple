import { createTheme } from "@mui/material";

const black = {
  100: "#d1d2d5",
  200: "#a3a6ab",
  300: "#767980",
  400: "#484d56",
  500: "#243448",
  600: "#151a23",
  700: "#10131a",
  800: "#0a0d12",
  900: "#050609",
  1000: "#0E1320",
};

// const purple = {
//   100: "#ece4fb",
//   200: "#d8c9f8",
//   300: "#c5adf4",
//   400: "#b192f1",
//   500: "#9e77ed",
//   600: "#7e5fbe",
//   700: "#5f478e",
//   800: "#3f305f",
//   900: "#20182f",
// };

// const green = {
//   100: "#daf1e4",
//   200: "#b6e4c9",
//   300: "#91d6ae",
//   400: "#6dc993",
//   500: "#48bb78",
//   600: "#3a9660",
//   700: "#2b7048",
//   800: "#1d4b30",
//   900: "#0e2518",
// };

// red: {
//     100: "#fcdddc",
//     200: "#f9bab9",
//     300: "#f59896",
//     400: "#f27573",
//     500: "#ef5350",
//     600: "#bf4240",
//     700: "#8f3230",
//     800: "#602120",
//     900: "#301110"
// },

const theme = createTheme({
  palette: {
    bgForm: {
      black1: "#0E1320",
      black2: "#1C2536",
      black3: "#111927",
    },
    text: {
      main: "#EDF2F7",
      secondary: "#A0AEC0",
      accent: "#6E53A5",
    },
    primary: {
      main: "#9e77ed",
    },
    secondary: {
      main: "#3f305f",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#48BB78",
    },
    error: {
      main: "#ef5350",
    },
    accent: {
      main: "#d4d9dd",
    },
  },
  typography: {
    fontFamily: "Plus Jakarta Sans",
    h6: {
      display: "block",
      marginBlockStart: "2.33rem",
      marginBlockEnd: "2.33rem",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    },
    h5: {
      fontWeight: "600",
    },
    h4: {
      fontWeight: "700",
      // fontSize: "18px",
    },
    h1: {
      display: "block",
      marginBlockStart: "1rem",
      marginBlockEnd: "1rem",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            color: "#EDF2F7",
            borderColor: "#69717b",
          },
          "& .MuiOutlinedInput-input": {
            color: "#fff",
          },
          "& input::placeholder": {
            color: "#EDF2F7",
          },
          "& .MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {
            color: "#EDF2F7",
          },
          "& input::-ms-reveal, & input::-ms-clear": { display: "none" },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #0f172a inset", // match dark bg
            WebkitTextFillColor: "#fff", // force white text
            caretColor: "#fff",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9e77ed",
          },

          "&:active .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9e77ed",
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2D3748",
          },
        },
        input: {
          "&.MuiOutlinedInput-input.Mui-disabled": {
            color: "red",
            "-webkit-text-fill-color": "#69717b",
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: black[400],
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#EDF2F7",
          "&.Mui-disabled": {
            color: "#69717b",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          fontSize: "0.875rem",
          fontWeight: "600px",
          borderRadius: "12px",
          textTransform: "capitalize",
          boxSizing: "border-box",
          ":disabled": {
            backgroundColor: "#3f305f",
            color: "black",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111927",
          color: "#EDF2F7",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1A222F",
            color: "#9e77ed", // Change the text color when hovering
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          "&:hover": {
            color: "#9e77ed",
          },
        },
      },
    },

    MuiMenuList: {
      root: {
        color: "#A0AEC0",
        paddingTop: 0,
        paddingBottom: 0,
        "&:hover": {
          color: "#9e77ed",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: "#252E3E",
            // transform: "scale(1.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "#252E3E",
            color: "#EDF2F7",
          },
          fontSize: "15px",
        },
      },
      defaultProps: {
        disableTouchRipple: true,
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          minWidth: "37px",
          padding: "0px",
          "&:hover": {
            color: "#9e77ed",
          },
          "&:focus": {
            color: "#9e77ed",
          },
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          borderColor: "#2D3748",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #2D3748",
          "&:hover": {
            backgroundColor: "#1A222F",
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1A222F",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          color: "#EDF2F7",
          backgroundColor: "#3f305f",
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.MuiPickersDay-root": {
            color: "#EDF2F7",
          },
          "&.MuiPickersDay-root.Mui-disabled:not(.Mui-selected)": {
            color: "rgb(255 255 255 / 38%)",
          },
          "&.MuiIconButton-root.Mui-disabled": {
            color: "rgb(255 255 255 / 26%)",
          },
          "&.MuiCheckbox-root.Mui-disabled": {
            color: "rgb(255 255 255 / 26%)",
          },
          "&.MuiChip-root .MuiChip-deleteIcon": {
            color: "rgb(255 255 255 / 59%)",
            "&:hover": {
              backgroundColor: "#1A222F",
              color: "#9e77ed",
            },
          },
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          "&.MuiFormControlLabel-root .MuiFormControlLabel-label.Mui-disabled": {
            color: "rgb(255 255 255 / 26%)",
          },
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "#283245",
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        expandIconWrapper: {
          color: "#ffff",
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#A0AEC0",
        },
      },
    },
  },
});

export { theme };
