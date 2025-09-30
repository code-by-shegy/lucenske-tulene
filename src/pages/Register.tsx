import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUser } from "../lib/users";

import type { Email, UserName } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState<Email>("");
  const [password, setPassword] = useState("");
  const [user_name, setName] = useState<UserName>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Create Firestore profile
      await createUser(cred.user.uid, email, user_name);

      // ✅ Redirect back to login page
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-icywhite">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm rounded-2xl bg-lightgrey p-6 shadow-lg"
      >
        <h1 className="mb-6 text-3xl font-bangers text-darkblue text-center">
          Tulení výtvor
        </h1>

        <div className="space-y-4">
          <Input
            label="Meno"
            type="text"
            value={user_name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
          />

          <Input
            label="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-6">
          <Button type="submit" variant="primary" size="md" fullWidth>
            Vytvor Tuleňa
          </Button>
        </div>

        <p className="mt-4 text-center font-roboto text-sm text-darkblack">
          Si bezmozeg a už máš účet?{" "}
          <Link to="/login" className= "font-roboto text-mediumblue hover:underline">
            Tu sa prihlás!
          </Link>
        </p>
      </form>
    </div>
  );
}