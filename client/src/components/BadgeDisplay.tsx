import { Badge } from "@/lib/types";
import { Link } from "wouter";
import { 
  ChevronRight, 
  Lock, 
  Brain, 
  Award, 
  Medal, 
  Flame, 
  Target, 
  Star, 
  TrendingUp,
  Zap,
  BookOpen,
  Trophy
} from "lucide-react";

interface BadgeDisplayProps {
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  limitVisible?: number;
}

// Function to map Material Icon names to Lucide components
const getLucideIcon = (iconName: string, className: string, color: string) => {
  const props = { className, style: { color } };
  
  switch (iconName) {
    case 'psychology':
      return <Brain {...props} />;
    case 'workspace_premium':
      return <Award {...props} />;
    case 'military_tech':
      return <Medal {...props} />;
    case 'local_fire_department':
      return <Flame {...props} />;
    case 'emoji_events':
      return <Trophy {...props} />;
    case 'travel_explore':
      return <Target {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'trending_up':
      return <TrendingUp {...props} />;
    case 'bolt':
      return <Zap {...props} />;
    case 'menu_book':
      return <BookOpen {...props} />;
    default:
      return <Star {...props} />;
  }
};

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
        <Link href="/badges" className="text-sm text-primary font-medium flex items-center">
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
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
              {getLucideIcon(badge.icon, "h-6 w-6", badge.backgroundColor)}
            </div>
            <span className="text-xs font-medium text-neutral-600 mt-1 text-center">
              {badge.name}
            </span>
          </div>
        ))}
        
        {visibleLockedBadges.map((badge) => (
          <div key={badge.id} className="badge flex-shrink-0 w-16 flex flex-col items-center opacity-40">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-neutral-200 border-2 border-neutral-300">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <span className="text-xs font-medium text-neutral-500 mt-1 text-center">Locked</span>
          </div>
        ))}
      </div>
    </div>
  );
}
