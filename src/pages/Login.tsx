import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";
import { ensureUserProfile } from "../lib/users";

type Props = {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
};

export default function Login({ onLoginSuccess, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await ensureUserProfile(res.user.uid, res.user.email);
        onLoginSuccess(res.user);
      }
    } catch (e: any) {
      console.error("Login failed", e);
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/seal-logo.png" // put your logo in /public/seal-logo.png
            alt="Lucenské Tulene"
            className="w-20 h-20 mb-3"
          />
          <h1 className="text-3xl font-bold text-blue-800">
            Lucenské Tulene 🦭
          </h1>
          <p className="text-slate-600">Cold Exposure Tracker</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@example.com"
        />

        {/* Password */}
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="••••••••"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Switch */}
        <div className="text-center text-sm text-slate-600 mt-4">
          <button
            onClick={onSwitchToRegister}
            className="underline text-blue-600 hover:text-blue-700"
          >
            Don’t have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}