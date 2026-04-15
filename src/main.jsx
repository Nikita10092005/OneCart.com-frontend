import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="674535370622-9ffbok6vc8sch1ommtfg1je9pikg22o5.apps.googleusercontent.com">
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </GoogleOAuthProvider>
);