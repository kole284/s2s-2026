import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss";
import { fixViewportHeight } from "@/utils/fixViewportHeight";
import { neutralizeTextZoom } from "@/utils/neutralizeTextZoom";

neutralizeTextZoom();
fixViewportHeight();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
