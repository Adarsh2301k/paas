import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ProviderAuthProvider } from "./context/ProviderAuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProviderAuthProvider>
      <App />
    </ProviderAuthProvider>
  </React.StrictMode>
);
