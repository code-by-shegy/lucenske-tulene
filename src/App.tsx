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
import StartSession from "./pages/StartSession";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="font-bangers flex h-screen items-center justify-center">
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

        {/* Protected routes */}
        <Route
          path="/"
          element={user ? <StartSession /> : <Navigate to="/login" />}
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

      {/* BottomNav - This will be visible on all pages after authentication */}
      {user && <Bottom />}
    </Router>
  );
}

export default App;
