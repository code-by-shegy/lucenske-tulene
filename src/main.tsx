import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with offline-first configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
      networkMode: "offlineFirst", // Try cache first, then network
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: 3,
    },
  },
});

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
