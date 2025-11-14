import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

const isDev = process.env.NODE_ENV === "development";

let basename = "/";

if (!isDev) {
  // Fallback to /board-app if PUBLIC_URL is not defined
  const rawPublicUrl = process.env.PUBLIC_URL || "/board-app";
  try {
    const url = new URL(rawPublicUrl, "https://dummy-base/");
    basename = url.pathname.replace(/\/$/, ""); // removes trailing slash safely
  } catch {
    basename = rawPublicUrl;
  }
}
// if (process.env.NODE_ENV !== "production") {
console.groupCollapsed("🌍 App environment info");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PUBLIC_URL:", process.env.PUBLIC_URL || "(not set)");
console.log("Resolved basename:", basename);
console.groupEnd();
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
