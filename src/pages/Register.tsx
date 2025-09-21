import React, { useState } from "react";
import type { User } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ensureUserProfile } from "../lib/users";

type Props = {
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
};

export default function Register({ onRegisterSuccess, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await ensureUserProfile(res.user.uid, res.user.email, nickname);
        onRegisterSuccess(res.user);
      }
    } catch (e: any) {
      console.error("Register failed", e);
      setError(e?.message ?? "Register failed");
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
          <h1 className="text-3xl font-bold text-blue-800">Register</h1>
          <p className="text-slate-600">Create your Tulene account</p>
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
          className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="••••••••"
        />

        {/* Nickname */}
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nickname
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Choose a display name"
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* Switch to Login */}
        <div className="text-center text-sm text-slate-600 mt-4">
          <button
            onClick={onSwitchToLogin}
            className="underline text-blue-600 hover:text-blue-700"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}