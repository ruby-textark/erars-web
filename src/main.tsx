import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { init_logger } from "erars-wasm";
import "./index.css";

import "./assets/fontawesome/css/fontawesome.css";
import "./assets/fontawesome/css/brands.css";
import "./assets/fontawesome/css/solid.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
