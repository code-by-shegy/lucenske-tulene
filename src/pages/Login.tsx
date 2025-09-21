import { useState } from "react";
import type { User } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
        <p className="text-slate-600 mb-6">Welcome back to Tulene</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <label className="block text-sm text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          placeholder="you@example.com"
        />

        <label className="block text-sm text-slate-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          placeholder="••••••••"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm text-slate-600 mt-4">
          <button
            onClick={onSwitchToRegister}
            className="underline text-sky-600 hover:text-sky-700"
          >
            Don’t have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}