import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/index.tsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: { main: "#556cd6" },
          secondary: { main: "#19857b" },
        }
      : {
          // palette values for dark mode
          primary: { main: "#778bdd" },
          secondary: { main: "#2e7d32" },
        }),
  },
});

let theme = createTheme(getDesignTokens("light")); // default to light mode

// Detect user's preference
const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

if (prefersDarkMode) {
  theme = createTheme(getDesignTokens("dark")); // Reassign theme for dark mode
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
