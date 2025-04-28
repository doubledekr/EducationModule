import MainLayout from "@/layouts/MainLayout";
import { userService } from "@/services/userService";
import { Badge as BadgeType } from "@/lib/types";

export default function BadgePage() {
  const earnedBadges = userService.getEarnedBadges();
  const lockedBadges = userService.getLockedBadges();
  
  const renderBadge = (badge: BadgeType, isLocked: boolean = false) => (
    <div 
      key={badge.id} 
      className={`bg-white rounded-xl shadow-sm p-4 ${isLocked ? "opacity-50" : ""}`}
    >
      <div className="flex items-center">
        <div 
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 mr-4`}
          style={{ 
            backgroundColor: isLocked ? "#f1f1f1" : `${badge.backgroundColor}10`,
            borderColor: isLocked ? "#d1d1d1" : badge.backgroundColor
          }}
        >
          <span 
            className="material-icons"
            style={{ color: isLocked ? "#9CA3AF" : badge.backgroundColor }}
          >
            {isLocked ? "lock" : badge.icon}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-nunito font-bold text-neutral-800">
            {isLocked ? "Locked Badge" : badge.name}
          </h3>
          <p className="text-sm text-neutral-500">
            {badge.description}
          </p>
          {badge.unlockedAt && !isLocked && (
            <p className="text-xs text-neutral-400 mt-1">
              Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-nunito font-bold text-2xl text-neutral-800 mb-2">
          Your Badges
        </h1>
        <p className="text-neutral-500">
          Collect badges by completing lessons and challenges
        </p>
      </div>
      
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
            Earned Badges ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedBadges.map(badge => renderBadge(badge))}
          </div>
        </div>
      )}
      
      {lockedBadges.length > 0 && (
        <div>
          <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
            Badges to Unlock ({lockedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedBadges.map(badge => renderBadge(badge, true))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
