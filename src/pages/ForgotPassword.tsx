import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import Page from "../components/Page";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return setError("Zadaj platnú e-mailovú adresu.");
    }

    // 1️⃣ Check if the user exists in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", normalizedEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return setError("Tuleň s týmto e-mailom neexistuje.");
    }

    try {
      // 2️⃣ Send Firebase password reset email
      await sendPasswordResetEmail(auth, normalizedEmail);

      // 3️⃣ Navigate to reset password page
      navigate("/reset-password", { state: { email: normalizedEmail } });
    } catch (err: any) {
      const code = err.code;
      let message = "Nastala chyba. Skús to znova.";

      switch (code) {
        case "auth/invalid-email":
          message = "Neplatná e-mailová adresa.";
          break;
        case "auth/user-not-found":
          message = "Tuleň s týmto e-mailom neexistuje.";
          break;
        case "auth/too-many-requests":
          message = "Príliš veľa pokusov. Skús to neskôr.";
          break;
      }

      setError(message);
    }
  };
  {
    error && <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <Page className="items-center justify-center">
      <Card>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <h1 className="font-bangers text-dark2blue text-center text-4xl">
            Reset Hesla
          </h1>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Poslať odkaz
          </Button>

          <p className="font-roboto text-darkblack text-center text-sm">
            Prebral si sa z kómy a už ti docvaklo?{" "}
            <Link to="/login" className="text-mediumblue hover:underline">
              <br />
              Tu sa prihlás!
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
