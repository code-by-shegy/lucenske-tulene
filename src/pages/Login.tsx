import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
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
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Page className="items-center justify-center px-4">
      <Card>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 ">
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Login
          </Button>

          <p className="font-roboto text-darkblack mt-4 text-center text-sm">
            Ešte nemáš účet ty primitív?{" "}
            <Link
              to="/register"
              className="font-roboto text-mediumblue hover:underline"
            >
              Tu sa registruj!
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
