import { Link, useLocation } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function Approval() {
  const location = useLocation();
  const email = location.state?.email ?? "tvoj e-mail";
  return (
    <Page className="items-center justify-center">
      <Card className="max-w-md">
        <Alert type="success" title="Tvoje heslo bolo resetované!">
          Skontroluj svoj email <span className="font-bold">{email}</span>,
          odoslal sa ti odkaz na reset hesla!
        </Alert>

        <div className="mt-3 flex justify-center">
          <Button>
            <Link to="/login">Späť na prihlásenie</Link>
          </Button>
        </div>
      </Card>
    </Page>
  );
}
