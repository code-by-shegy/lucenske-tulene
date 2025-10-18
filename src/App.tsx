import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Bottom from "./components/Bottom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Session from "./pages/Session";
//import ColdShower from "./pages/ColdShower";
//import ColdPlunge from "./pages/ColdPlunge";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Approval from "./pages/Approval";
import ApprovalLogin from "./pages/ApprovalLogin";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Wait until Firebase finishes checking user state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!authChecked) {
    // 👇 This ensures no routes are rendered until auth is ready
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
