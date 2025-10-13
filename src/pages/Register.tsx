import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { createUser } from "../lib/db_users";

import Input from "../components/Input";
import Button from "../components/Button";
import Page from "../components/Page";
import Card from "../components/Card";
import Alert from "../components/Alert";

import type { Email, UserName } from "../types";

export default function Register() {
  const [email, setEmail] = useState<Email>("");
  const [password, setPassword] = useState("");
  const [user_name, setName] = useState<UserName>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user_name.length < 3 || user_name.length > 15) {
      setError("Meno musí mať 3 až 15 znakov.");
      return;
    }

    if (!/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(user_name)) {
      setError("Meno môže obsahovať len písmená, čísla a 1 medzeru.");
      return;
    }

    const usersRef = collection(db, "users");
    const nameQuery = query(usersRef, where("user_name", "==", user_name));
    const nameSnapshot = await getDocs(nameQuery);

    if (!nameSnapshot.empty) {
      setError("Toto meno je už obsadené.");
      return;
    }
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const cred = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      await createUser(cred.user.uid, normalizedEmail, user_name);
      navigate("/approval", { state: { email: normalizedEmail } });
      await auth.signOut();
    } catch (err: any) {
      const code = err.code;
      let message = "Neznáma chyba. Skús to znova.";

      switch (code) {
        case "auth/missing-email":
          message = "Email je prázdny. Zadaj platný email.";
          break;
        case "auth/invalid-email":
          message = "Neplatná e-mailová adresa.";
          break;
        case "auth/email-already-in-use":
          message = "Tento e-mail je už zaregistrovaný.";
          break;
        case "auth/missing-password":
        case "auth/weak-password":
        case "auth/password-does-not-meet-requirements":
          message =
            "Heslo musí mať aspoň 6 znakov, jedno veľké a jedno malé písmeno.";
          break;
        case "auth/too-many-requests":
          message = "Príliš veľa pokusov. Skús to neskôr.";
          break;
      }

      setError(message);
    }
  };

  return (
    <Page className="items-center justify-center">
      <Card>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <h1 className="font-bangers text-dark2blue text-center text-4xl">
            Registrácia
          </h1>

          <Input
            label="Meno"
            type="text"
            value={user_name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
          />
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

          {error && <Alert type="error">{error}</Alert>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Vytvoriť Tuleňa
          </Button>

          <p className="font-roboto text-darkblack text-center text-sm">
            Si bezmozeg a už máš tuleňa?{" "}
            <Link
              to="/login"
              className="font-roboto text-mediumblue hover:underline"
            >
              <br />
              Tu sa prihlás!
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
