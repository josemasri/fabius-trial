import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const darkTheme = createTheme({
    palette: {
      mode: "dark"
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
