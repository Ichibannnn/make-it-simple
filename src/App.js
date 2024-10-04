import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { theme } from "./theme/theme";
import { SignalRProvider } from "./context/SignalRContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ParameterProvider } from "./context/ParameterContext";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SignalRProvider>
        <ParameterProvider>
          <RouterProvider router={router} />
        </ParameterProvider>
      </SignalRProvider>
    </ThemeProvider>
  );
};

export default App;
