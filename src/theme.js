import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1A237E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7986cb",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#5f5f5f",
    },
  },
  typography: {
    fontSize: 13, // base font size in px (MUI default is 14)
    htmlFontSize: 16, // this remains standard for rem scaling

    h1: { fontSize: "2.25rem" },
    h2: { fontSize: "1.75rem" },
    h3: { fontSize: "1.5rem" },
    h4: { fontSize: "1.25rem" },
    h5: { fontSize: "1.1rem" },
    h6: { fontSize: "1rem" },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.75rem" },
    subtitle1: { fontSize: "0.8rem" },
    subtitle2: { fontSize: "0.7rem" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
  },
});

export default theme;
