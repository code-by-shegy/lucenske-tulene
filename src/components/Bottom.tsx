import { Link, useLocation } from "react-router-dom";
import { ICONS } from "../constants";

export default function BottomNav() {
  const loc = useLocation();

  const itemClass = (path: string) =>
    `flex h-[75%] flex-1 items-center justify-center rounded-2xl transition ${
      loc.pathname === path ? "bg-icywhite" : ""
    }`;

  return (
    // Set the parent (blue navbar) to scale with VH, but also have min and max.
    // Childs can then just scale with vh-%.
    <nav className="bg-dark2blue fixed bottom-0 left-0 z-50 h-[10vh] max-h-[80px] min-h-[56px] w-full pb-[env(safe-area-inset-bottom)] shadow-inner">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-around px-6">
        <Link to="/" aria-label="Start session" className={itemClass("/")}>
          <img
            src={ICONS.padded.stopwatch}
            alt="Start session"
            className="h-[60%] w-auto transform object-contain transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>

        <Link
          to="/leaderboard"
          aria-label="Leaderboard"
          className={itemClass("/leaderboard")}
        >
          <img
            src={ICONS.padded.leaderboard}
            alt="Leaderboard"
            className="h-[60%] w-auto transform object-contain transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>

        <Link
          to="/profile"
          aria-label="Profile"
          className={itemClass("/profile")}
        >
          <img
            src={ICONS.padded.seal}
            alt="Profile"
            className="h-[60%] w-auto transform object-contain transition-transform duration-200 hover:scale-110 active:scale-95"
          />
        </Link>
      </div>
    </nav>
  );
}
