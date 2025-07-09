import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { theme } from "./theme/theme";
import { SignalRProvider } from "./context/SignalRContext";
import { ParameterProvider } from "./context/ParameterContext";
import { Toaster } from "sonner";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster richColors position="top-right" closeButton />
      {/* <SignalRProvider> */}
      <ParameterProvider>
        <RouterProvider router={router} />
      </ParameterProvider>
      {/* </SignalRProvider> */}
    </ThemeProvider>
  );
};

export default App;
