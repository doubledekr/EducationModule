import { Badge } from "@/lib/types";
import { Link } from "wouter";

interface BadgeDisplayProps {
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  limitVisible?: number;
}

export default function BadgeDisplay({ 
  earnedBadges, 
  lockedBadges, 
  limitVisible = 5 
}: BadgeDisplayProps) {
  // Show a combination of earned and locked badges up to the limit
  const visibleEarnedBadges = earnedBadges.slice(0, limitVisible);
  const visibleLockedBadges = lockedBadges.slice(
    0, 
    Math.max(0, limitVisible - visibleEarnedBadges.length)
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-nunito font-bold text-lg text-neutral-800">Your Badges</h2>
        <Link href="/badges">
          <a className="text-sm text-primary font-medium flex items-center">
            View all
            <span className="material-icons text-sm ml-1">chevron_right</span>
          </a>
        </Link>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {visibleEarnedBadges.map((badge) => (
          <div key={badge.id} className="badge flex-shrink-0 w-16 flex flex-col items-center">
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center bg-opacity-10 border-2`}
              style={{ 
                backgroundColor: `${badge.backgroundColor}10`, 
                borderColor: badge.backgroundColor 
              }}
            >
              <span className="material-icons" style={{ color: badge.backgroundColor }}>
                {badge.icon}
              </span>
            </div>
            <span className="text-xs font-medium text-neutral-600 mt-1 text-center">
              {badge.name}
            </span>
          </div>
        ))}
        
        {visibleLockedBadges.map((badge) => (
          <div key={badge.id} className="badge flex-shrink-0 w-16 flex flex-col items-center opacity-40">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-neutral-200 border-2 border-neutral-300">
              <span className="material-icons text-neutral-400">lock</span>
            </div>
            <span className="text-xs font-medium text-neutral-500 mt-1 text-center">Locked</span>
          </div>
        ))}
      </div>
    </div>
  );
}
