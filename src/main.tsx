import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppStateProvider } from "./state/AppState";
import "./styles/global.css";

function registerServiceWorkerLater() {
  if (!("serviceWorker" in navigator)) return;

  const register = () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Error registrando service worker:", error);
    });
  };

  if ("requestIdleCallback" in window) {
    (window as Window & {
      requestIdleCallback: (callback: () => void) => void;
    }).requestIdleCallback(register);
  } else {
    setTimeout(register, 1500);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppStateProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppStateProvider>
);

registerServiceWorkerLater();