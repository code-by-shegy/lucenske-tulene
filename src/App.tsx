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

  const handleRegisterSuccess = () => {
    // After register, go back to login
    setScreen("login");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  if (screen === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "home" && user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return null;
}

export default App;
