import { Link, useLocation } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import Alert from "../components/Alert";

export default function Approval() {
  const location = useLocation();
  const email = location.state?.email;
  return (
    <Page className="items-center justify-center px-4">
      <Card className="max-w-md">
        <Alert type="success">
          <h2 className="font-bangers mb-2 text-2xl text-green-800">
            ✅ Tvoja registrácia bola odoslaná!
          </h2>
          <p className="text-sm text-green-700">
            Po schválení administrátorom budeš prijatý medzi tuleňov: {email}
          </p>
        </Alert>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Späť na prihlásenie
          </Link>
        </div>
      </Card>
    </Page>
  );
}
