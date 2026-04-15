import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "399384649538-v2s15h5fa6dfb12m7btndu15e740c278.apps.googleusercontent.com"}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </GoogleOAuthProvider>
);