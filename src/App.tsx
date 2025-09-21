import { useState } from "react";
import type { User } from "firebase/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  const [screen, setScreen] = useState<"login" | "register" | "home">("login");
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setScreen("home");
  };

  const handleRegisterSuccess = (newUser: User) => {
    setUser(newUser);
    setScreen("home"); // ✅ go straight to Home instead of back to login
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  return (
    <>
      {screen === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setScreen("register")}
        />
      )}

      {screen === "register" && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setScreen("login")}
        />
      )}

      {screen === "home" && user && (
        <Home user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;