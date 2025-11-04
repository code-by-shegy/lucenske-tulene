// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const prevUserRef = useRef<User | null>(null); // ✅ keep reference to last user

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // --- 🧹 Handle logout: user became null ---
      if (!firebaseUser && prevUserRef.current) {
        const token = localStorage.getItem("fcm_token");
        if (token) {
          try {
            // ✅ Use previous user's UID from ref (not `user`, not `firebaseUser`)
            await unregisterPushToken(prevUserRef.current.uid, token);
            console.log(
              "🧹 Unregistered FCM token for",
              prevUserRef.current.uid,
            );
            localStorage.removeItem("fcm_token");
          } catch (err) {
            console.warn("Failed to unregister push token:", err);
          }
        }
      }

      // --- 👤 Update state + remember previous user ---
      prevUserRef.current = firebaseUser;
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
