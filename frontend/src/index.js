import React from "react";
import ReactDOM from "react-dom/client";
import "./output.css";
import "leaflet/dist/leaflet.css"; // Add this
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="821797666759-78tppjpd5md4sls4h6k9un0jhmg6b335.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
