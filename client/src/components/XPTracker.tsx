import { calculateXPLevelProgress } from "@/lib/utils";

interface XPTrackerProps {
  xp: number;
}

export default function XPTracker({ xp }: XPTrackerProps) {
  const { currentLevel, progress } = calculateXPLevelProgress(xp);
  
  return (
    <div className="relative flex items-center">
      <div 
        className="w-10 h-10 rounded-full relative" 
        style={{ 
          background: `conic-gradient(#4C49E8 ${progress}%, #E1E5EB ${progress}%)` 
        }}
      >
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{xp}</span>
        </div>
      </div>
      <div className="ml-1">
        <span className="text-xs font-medium text-neutral-500">Level {currentLevel}</span>
      </div>
    </div>
  );
}
