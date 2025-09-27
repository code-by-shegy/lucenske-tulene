import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/login"); // redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Page>
      <Header title="Lučenské Tulene" />

      <main className="flex-1 flex flex-col justify-center items-center gap-4 px-6 bg-lightgrey">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/startsession")}
        >
          Začať otužovať
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/leaderboard")}
        >
          Tabuľka
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/profile")}
        >
          Môj Profil
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleLogout}
        >
          Odhlásiť sa
        </Button>

      </main>
    </Page>
  );
}