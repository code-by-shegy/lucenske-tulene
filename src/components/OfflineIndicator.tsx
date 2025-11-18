import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(10vh+0.5rem)] z-40 mx-auto max-w-screen-xl px-4">
      <div className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white shadow-lg">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">
          Si offline. Zmeny sa synchronizujú keď budeš online.
        </span>
      </div>
    </div>
  );
}
