import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import Page from "../components/Page";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 🔹 New: Check if user is approved
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists() || !userDoc.data()?.approved) {
        setError("Tvoj účet ešte nebol schválený administrátorom.");
        await auth.signOut();
        return;
      }

      navigate("/"); // proceed only if verified
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
    }
  };
  return (
    <Page className="items-center justify-center px-3">
      <Card>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <h1 className="font-bangers text-darkblue text-center text-4xl">
            Tulení Nábor
          </h1>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="font-roboto text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Login
          </Button>

          <p className="font-roboto text-darkblack text-center text-sm">
            Ešte nemáš účet ty primitív?{" "}
            <Link
              to="/register"
              className="font-roboto text-mediumblue hover:underline"
            >
              Tu sa registruj!
            </Link>
          </p>

          <p className="font-roboto text-darkblack text-center text-sm">
            Zabudol si heslo?{" "}
            <Link
              to="/forgot-password"
              className="font-roboto text-mediumblue hover:underline"
            >
              Resetuj ho
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
