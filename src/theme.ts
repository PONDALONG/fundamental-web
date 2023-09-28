import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  zIndex: {
    modal: 1050
  },
  palette: {
    primary: {
      main: "#352F44",
      light: "#10254a",
    },
    secondary: {
      main: "#5C5470",
      dark: "#1FB2B4",
      contrastText: "#fff",
    },
    info: {
      main: "#1C84C6",
      dark: "#416393",
      contrastText: "#fff",
    },
    success: {
      main: "#6fbf73",
      dark: "#3e8e46",
      contrastText: "#fff",
    },
    warning: {
      main: "#f8AC59",
      dark: "#ffa000",
      contrastText: "#fff",
    },
    error: {
        main: "#ED5565",
        dark: "#D54C5A",
        contrastText: "#fff"
    }
  },
  typography: {
    fontFamily: 'Sarabun , sans-serif'
  },
});