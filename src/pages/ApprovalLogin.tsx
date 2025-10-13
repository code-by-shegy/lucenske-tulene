import { useLocation, Link } from "react-router-dom";

import Page from "../components/Page";
import Card from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function Approval() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <Page className="items-center justify-center">
      <Card className="max-w-md">
        <Alert
          type="warning"
          title="Valné zhromaždenie tulenej rady ešte nerozhodlo!"
        >
          Tvoj tuleň s emailom <span className="font-bold">{email}</span> bol
          úspešne vytvorený, ale ešte musí byť schválený tuleňou radou. Skús to
          prosím neskôr, alebo napíš správu na{" "}
          <a
            href="https://www.instagram.com/lucensketulene/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mediumblue hover:underline"
          >
            Instagram Lučenských tuleňov!
          </a>
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
