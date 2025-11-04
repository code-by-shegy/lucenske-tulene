// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import type { User } from "firebase/auth";
import { unregisterPushToken } from "../lib/messaging"; // ✅ import this

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // --- 🧹 Handle logout: remove FCM token if present ---
      const prevUser = user;
      if (!firebaseUser && prevUser) {
        const token = localStorage.getItem("fcm_token");
        if (token) {
          try {
            await unregisterPushToken(prevUser.uid, token);
            console.log("🧹 Unregistered FCM token for", prevUser.uid);
            localStorage.removeItem("fcm_token");
          } catch (err) {
            console.warn("Failed to unregister push token:", err);
          }
        }
      }

      // --- 👤 Update state ---
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
