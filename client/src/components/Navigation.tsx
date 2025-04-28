import { useLocation, Link } from "wouter";

export default function Navigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="bg-white border-t border-neutral-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <div className={`flex flex-col items-center py-2 px-4 cursor-pointer ${isActive("/") ? "text-primary" : "text-neutral-400"}`}>
              <span className="material-icons">home</span>
              <span className="text-xs mt-1 font-medium">Home</span>
            </div>
          </Link>
          
          <Link href="/lesson/1/1">
            <div className={`flex flex-col items-center py-2 px-4 cursor-pointer ${isActive("/lesson") ? "text-primary" : "text-neutral-400"}`}>
              <span className="material-icons">school</span>
              <span className="text-xs mt-1 font-medium">Learn</span>
            </div>
          </Link>
          
          <Link href="/progress">
            <div className={`flex flex-col items-center py-2 px-4 cursor-pointer ${isActive("/progress") ? "text-primary" : "text-neutral-400"}`}>
              <span className="material-icons">leaderboard</span>
              <span className="text-xs mt-1 font-medium">Progress</span>
            </div>
          </Link>
          
          <Link href="/badges">
            <div className={`flex flex-col items-center py-2 px-4 cursor-pointer ${isActive("/badges") ? "text-primary" : "text-neutral-400"}`}>
              <span className="material-icons">emoji_events</span>
              <span className="text-xs mt-1 font-medium">Badges</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
