import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Page from "../components/Page";
import Input from "../components/Input";
import Button from "../components/Button";

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
    <Page>
      <div className="flex h-screen items-center justify-center bg-icywhite">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-lightgrey p-6 shadow-lg"
        >
          <h1 className="mb-6 text-3xl font-bangers text-darkblue text-center">
            Tulení Nábor
          </h1>

          <div className="mb-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <Input
              label="Heslo"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Login
          </Button>

          <p className="mt-6 text-center text-sm text-darkblack font-roboto">
            Ešte nemáš účet ty primitív?{" "}
            <Link to="/register" className="font-roboto text-mediumblue hover:underline">
              Tu sa registruj!
            </Link>
          </p>
        </form>
      </div>
    </Page>
  );
}