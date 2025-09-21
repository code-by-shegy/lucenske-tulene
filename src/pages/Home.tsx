import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

type Props = {
  user: any;
  onLogout: () => void;
};

export default function Home({ user, onLogout }: Props) {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="/seal-logo.png"
            alt="Tulene logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-blue-800">Lucenské Tulene 🦭❄️</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">
          Welcome, {user?.displayName || user?.email} 👋
        </h2>
        <p className="text-slate-600">
          This is your <strong>home screen</strong>.  
          Soon you’ll see: session logs, leaderboards, and more!
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-slate-500 text-sm py-3 shadow-inner">
        © {new Date().getFullYear()} Lucenské Tulene
      </footer>
    </div>
  );
}
