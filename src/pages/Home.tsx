// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Page>
      <Header title="Home" />

      <main className="flex-1 flex flex-col justify-center items-center gap-4 px-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/startsession")}
        >
          Start New Session
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate("/profile")}
        >
          My Profile
        </Button>
      </main>
    </Page>
  );
}