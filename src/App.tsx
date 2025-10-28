// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="font-bangers text-darkblack flex h-screen items-center justify-center px-3 text-center text-4xl sm:text-5xl md:text-6xl">
        Obrovské zdravíčko!
      </div>
    );
  }

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
