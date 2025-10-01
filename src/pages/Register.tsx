import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUser } from "../lib/users";
import type { Email, UserName } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";
import Page from "../components/Page";

export default function Register() {
  const [email, setEmail] = useState<Email>("");
  const [password, setPassword] = useState("");
  const [user_name, setName] = useState<UserName>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUser(cred.user.uid, email, user_name);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Page className="flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-4xl font-bangers text-darkblue text-center">
          Tulení výtvor
        </h1>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 w-full rounded-2xl bg-icywhite p-6 shadow-lg"
        >
          <Input
            label="Meno"
            type="text"
            value={user_name}
            onChange={(e) => setName(e.target.value)}
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Vytvor Tuleňa
          </Button>

          <p className="text-center font-roboto text-sm text-darkblack mt-4">
            Si bezmozeg a už máš účet?{" "}
            <Link to="/login" className="font-roboto text-mediumblue hover:underline">
              Tu sa prihlás!
            </Link>
          </p>
        </form>
      </div>
    </Page>
  );
}