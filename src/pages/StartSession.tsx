import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function StartSession() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header title="Start a new session" onBack={() => navigate("/")} />
      <div className="flex-1 flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Start a new session</h1>
      </div>
    </div>
  );
}