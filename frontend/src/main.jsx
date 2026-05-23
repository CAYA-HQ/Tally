import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationProvider } from "./context/notificationContext.jsx";
import App from "./App.jsx";
import "./utils/session/refreshSession";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>
);
