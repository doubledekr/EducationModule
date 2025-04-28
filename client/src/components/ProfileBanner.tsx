import { User } from "@/lib/types";

interface ProfileBannerProps {
  user: User;
  currentStage: number;
  totalStages: number;
  stageProgress: number;
}

export default function ProfileBanner({ 
  user, 
  currentStage, 
  totalStages, 
  stageProgress 
}: ProfileBannerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-nunito font-bold text-lg text-neutral-800">
            Hey, <span className="text-primary">{user.firstName}</span>!
          </h2>
          <p className="text-sm text-neutral-500">Keep learning to build your financial future</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-neutral-700">
            Stage {currentStage} of {totalStages}
          </div>
          <div className="w-24 h-2 bg-neutral-200 rounded-full mt-1">
            <div 
              className="h-full bg-secondary rounded-full" 
              style={{ width: `${stageProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
