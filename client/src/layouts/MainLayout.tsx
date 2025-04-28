import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import XPTracker from "@/components/XPTracker";
import StreakCounter from "@/components/StreakCounter";
import { useUser } from "@/context/UserContext";
import { Link } from "wouter";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <div className="font-nunito font-bold text-xl text-primary cursor-pointer">
                Dekr<span className="text-secondary">Finance</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <XPTracker xp={user.xp} />
            <StreakCounter streakDays={user.streakDays} />
            
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center cursor-pointer">
                <span className="material-icons text-neutral-700 text-sm">person</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
