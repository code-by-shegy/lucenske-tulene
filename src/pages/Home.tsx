// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Page className="bg-icywhite">
      <Header title="Home" className="bg-oceanblue text-white" />

      <div className="flex-1 flex flex-col justify-center items-center gap-6 px-6">
        
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
      </div>
    </Page>
  );
}