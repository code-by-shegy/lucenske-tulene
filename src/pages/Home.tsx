// src/pages/Home.tsx
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getUserProfile } from "../lib/users";

export default function Home({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const profile = await getUserProfile(user.uid);
        if (profile?.name) {
          setNickname(profile.name);
        }
      }
    }
    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Home Screen 🦭
      </h1>
      <p className="text-lg mb-4">
        Welcome, <span className="font-semibold">{nickname ?? user.email}</span>
      </p>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
