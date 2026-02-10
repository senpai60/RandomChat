import { createRoot } from "react-dom/client";
import "./index.scss";
import "./ui.scss";
import "./layout.scss";
import { UserProvider } from "./context/UserContext.jsx";

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
