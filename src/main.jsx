import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import App from "./App.jsx";

// This file starts React and puts <App /> on the page. You never edit it.
// Part 7: BrowserRouter watches the address bar and lets App choose a page from it.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
