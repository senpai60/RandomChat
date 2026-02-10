import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import "./ui.scss";
import "./layout.scss";
import { UserProvider } from "./context/UserContext.jsx";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
  </UserProvider>,
);
