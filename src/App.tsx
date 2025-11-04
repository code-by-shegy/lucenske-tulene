// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

import {
  setupForegroundHandler,
  registerForPushNotifications,
} from "./lib/messaging";

import Bottom from "./components/Bottom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Session from "./pages/Session";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Approval from "./pages/Approval";
import ApprovalLogin from "./pages/ApprovalLogin";
import ResetPassword from "./pages/ResetPassword";

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY as string;

function App() {
  const { user, loading } = useAuth();

  // --- 📲 Set up FCM foreground listener once on mount ---
  useEffect(() => {
    setupForegroundHandler();
  }, []);

  // --- 🔐 Register push token when user logs in ---
  useEffect(() => {
    if (user) {
      registerForPushNotifications(user, VAPID_KEY)
        .then((token) => {
          if (token) console.log("✅ Registered FCM token:", token);
        })
        .catch((err) =>
          console.error("Push notification registration failed:", err),
        );
    }
  }, [user]);

  // --- 🌀 Loading state ---
  if (loading) {
    return (
      <div className="font-bangers text-darkblack flex h-screen items-center justify-center px-3 text-center text-4xl sm:text-5xl md:text-6xl">
        Obrovské zdravíčko!
      </div>
    );
  }

  // --- 🧭 Routes ---
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route path="/approval" element={<Approval />} />
        <Route path="/approval-login" element={<ApprovalLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={user ? <Session /> : <Navigate to="/login" />}
        />
        <Route
          path="/leaderboard"
          element={user ? <Leaderboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>

      {/* BottomNav - visible only when logged in */}
      {user && <Bottom />}
    </Router>
  );
}

export default App;
