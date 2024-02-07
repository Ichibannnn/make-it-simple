import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

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

const theme = createTheme({
  palette: {
    bgForm: {
      black1: "#0E1320",
      black2: "#1C2536",
      black3: "#111927",
    },
    primary: {
      main: "#9e77ed",
    },
    secondary: {
      main: "#3f305f",
    },
    success: {
      main: "#48BB78",
    },
    warning: {
      main: "#ff9800",
    },
    error: {
      main: "#ef5350",
    },
  },
  typography: {
    color: {
      main: "#EDF2F7",
      secondary: "#A0AEC0",
      accent: "#9e77ed",
    },
    h6: {
      display: "block",
      marginBlockStart: "2.33rem",
      marginBlockEnd: "2.33rem",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
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
          backgroundColor: black[600],
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: black[600],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
          "& .Mui-active .MuiOutlinedInput-notchedOutline": {
            color: black[600],
            borderColor: black[600],
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            color: black[600],
            borderColor: black[600],
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
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          fontSize: "0.875rem",
          fontWeight: "600px",
          borderRadius: "12px",
          // textTransform: "capitalize",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 2px",
          boxSizing: "border-box",
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
            transform: "scale(1.3)",
          },
        },
      },
    },
    MuiMenuList: {
      root: {
        color: "#A0AEC0",
        "&:hover": {
          color: "#9e77ed",
          transform: "scale(1.1)",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#A0AEC0",
          "&:hover": {
            color: "#9e77ed",
            transform: "scale(1.1)",
          },
        },
      },
    },
  },
});

export { theme };
