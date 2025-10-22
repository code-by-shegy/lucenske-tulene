import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import Page from "../components/Page";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

import iconLogo from "../assets/icons/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // prevent double-click spam
    setError("");
    setLoading(true); // start loading
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return setError("Zadaj platnú emailovú adresu.");
      }

      // 1. Check user in Firestore users collection.
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return setError("Tuleň s týmto e-mailom neexistuje.");
      }

      const userDoc = querySnapshot.docs[0];
      const approved = userDoc.data().approved;

      if (!approved) {
        return navigate("/approval-login", {
          state: { email: normalizedEmail },
        }); // stop here, no Firebase Auth login
      }

      // 2. User is approved → log in with Firebase Auth.
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      navigate("/"); // proceed normally
    } catch (err: any) {
      const code = err.code;
      let message = err.message;

      switch (code) {
        case "auth/invalid-email":
          message = "Neplatná e-mailová adresa.";
          break;
        case "auth/invalid-credential":
          message = "Nesprávne prihlasovacie údaje.";
          break;
        case "auth/user-not-found":
          message = "Používateľ s týmto e-mailom neexistuje.";
          break;
        case "auth/wrong-password":
        case "auth/missing-password":
          message = "Zlé heslo, tuleň!";
          break;
        case "auth/too-many-requests":
          message = "Príliš veľa pokusov. Skús to neskôr.";
          break;
      }

      setError(message);
    } finally {
      setLoading(false); // always reset loading
    }
  };
  return (
    <Page className="items-center justify-center">
      <Card>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex justify-center">
            <img src={iconLogo} alt="Logo" className="h-[10em] w-[10em]" />
          </div>

          <h1 className="font-bangers text-dark2blue text-center text-4xl">
            Prihlásenie
          </h1>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="border-3 p-2"
          />

          <Input
            label="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputClassName="border-3 p-2"
          />

          {error && (
            <p className="font-roboto text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading}
          >
            {loading ? "Prihlasujem..." : "Prihlásiť sa"}
          </Button>

          <p className="font-roboto text-darkblack text-center text-sm">
            Ešte nemáš tuleňa ty primitív?{" "}
            <Link
              to="/register"
              className="font-roboto text-mediumblue hover:underline"
            >
              <br />
              Tu ho vytvor!
            </Link>
          </p>

          <p className="font-roboto text-darkblack text-center text-sm">
            Si po lobotómií a zabudol si heslo?{" "}
            <Link
              to="/forgot-password"
              className="font-roboto text-mediumblue hover:underline"
            >
              <br /> Tu ho resetuj!
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
