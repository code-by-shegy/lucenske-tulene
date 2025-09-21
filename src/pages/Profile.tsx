import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header title="My Profile" onBack={() => navigate("/")} />
      <div className="flex-1 flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>
    </div>
  );
}
