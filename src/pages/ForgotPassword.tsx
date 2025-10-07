import { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Skontroluj svoj email – odoslal sa ti odkaz na reset hesla!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Page className="items-center justify-center px-4">
      <Card>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <h1 className="font-bangers text-darkblue text-center text-4xl">
            Reset Hesla
          </h1>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && <p className="text-sm text-green-500">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" size="md" fullWidth>
            Poslať odkaz na reset hesla
          </Button>

          <p className="font-roboto text-darkblack mt-4 text-center text-sm">
            Spomenul si si heslo?{" "}
            <Link to="/login" className="text-mediumblue hover:underline">
              Prihlás sa
            </Link>
          </p>
        </form>
      </Card>
    </Page>
  );
}
