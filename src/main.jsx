import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "674535370622-9ffbok6vc8sch1ommtfg1je9pikg22o5.apps.googleusercontent.com"}>
    <ThemeProvider>
      <ErrorBoundary><App /></ErrorBoundary>
    </ThemeProvider>
  </GoogleOAuthProvider>
);
