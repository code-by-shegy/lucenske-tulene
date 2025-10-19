import { Link, useLocation } from "react-router-dom";
import iconStopwatch from "../assets/icons/timer.svg";
import iconLeaderboard from "../assets/icons/leaderboard.svg";
import iconSeal from "../assets/icons/seal.svg";

export default function BottomNav() {
  const loc = useLocation();

  const itemClass = (path: string) =>
    `flex items-center justify-center w-16 h-12 rounded-md transition ${
      loc.pathname === path ? "bg-icywhite" : "hover:bg-mediumgrey/60"
    }`;

  return (
    <nav className="bg-dark2blue fixed bottom-0 left-0 z-50 h-[10vh] w-full shadow-inner">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-around px-6">
        <Link to="/" aria-label="Start session" className={itemClass("/")}>
          <img
            src={iconStopwatch}
            alt="Start"
            className="h-[3em] w-[3em] transform transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>

        <Link
          to="/leaderboard"
          aria-label="Leaderboard"
          className={itemClass("/leaderboard")}
        >
          <img
            src={iconLeaderboard}
            alt="Leaderboard"
            className="h-[5em] w-[5em] transform transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>

        <Link
          to="/profile"
          aria-label="Profile"
          className={itemClass("/profile")}
        >
          <img
            src={iconSeal}
            alt="Profile"
            className="h-[5em] w-[5em] transform transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>
      </div>
    </nav>
  );
}
