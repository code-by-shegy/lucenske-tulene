import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster
          toastOptions={{
            duration: 4000, // sets all toasts to 4s
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
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
