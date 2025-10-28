import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      {/* ✅ Wrap the app so all children can access auth state */}
      <App />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
);

registerSW({
  onNeedRefresh() {
    toast("Nová verzia aplikácie je pripravená! Obnov stránku 🔄");
  },
  onOfflineReady() {
    toast.success("Aplikácia je pripravená offline ✅");
  },
});
