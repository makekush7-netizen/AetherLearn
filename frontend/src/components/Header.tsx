import { Link } from "react-router-dom";
import { BookOpen, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
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

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">AetherLearn</span>
        </Link>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-2 text-sm text-accent">
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <WifiOff className="h-4 w-4" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
