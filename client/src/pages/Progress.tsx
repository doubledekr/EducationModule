import MainLayout from "@/layouts/MainLayout";
import { useUser } from "@/context/UserContext";
import { useLessons } from "@/context/LessonContext";
import { useState, useEffect } from "react";
import { calculateXPLevelProgress } from "@/lib/utils";
import { Progress as ProgressBar } from "@/components/ui/progress";

export default function ProgressPage() {
  const { user } = useUser();
  const { stages, loading } = useLessons();
  const [stageProgressData, setStageProgressData] = useState<any[]>([]);
  
  const { currentLevel, levelXP, nextLevelXP, progress } = calculateXPLevelProgress(user.xp);
  
  useEffect(() => {
    if (!loading && stages.length > 0) {
      // Calculate progress for each stage
      const stageProgress = stages.map(stage => {
        const lessonsInStage = stage.lessons.length;
        const completedLessonsInStage = user.completedLessons.filter(
          lesson => lesson.stageId === stage.id
        ).length;
        
        const progressPercentage = Math.round((completedLessonsInStage / lessonsInStage) * 100);
        
        return {
          id: stage.id,
          title: stage.title,
          lessonsTotal: lessonsInStage,
          lessonsCompleted: completedLessonsInStage,
          progressPercentage,
          isLocked: user.xp < stage.requiredXP
        };
      });
      
      setStageProgressData(stageProgress);
    }
  }, [loading, stages, user.completedLessons, user.xp]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-icons animate-spin text-primary text-2xl">refresh</span>
            <p className="mt-2 text-neutral-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-nunito font-bold text-2xl text-neutral-800 mb-1">
          Your Progress
        </h1>
        <p className="text-neutral-500">
          Track your learning journey
        </p>
      </div>
      
      {/* XP and Level Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-nunito font-bold text-lg text-neutral-800">
            Level {currentLevel}
          </h2>
          <span className="text-primary font-bold">{user.xp} XP</span>
        </div>
        
        <ProgressBar value={progress} className="mb-2" />
        
        <div className="flex justify-between text-xs text-neutral-500">
          <span>{levelXP} XP</span>
          <span>{nextLevelXP} XP needed for Level {currentLevel + 1}</span>
        </div>
      </div>
      
      {/* Streak Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
            <span className="material-icons text-accent">local_fire_department</span>
          </div>
          <div>
            <h2 className="font-nunito font-bold text-lg text-neutral-800">
              {user.streakDays} Day Streak
            </h2>
            <p className="text-sm text-neutral-500">
              Keep it going! Log in tomorrow to maintain your streak.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stage Progress Section */}
      <div className="mb-6">
        <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
          Stage Progress
        </h2>
        
        <div className="space-y-4">
          {stageProgressData.map(stage => (
            <div 
              key={stage.id}
              className={`bg-white rounded-xl shadow-sm p-4 ${stage.isLocked ? "opacity-60" : ""}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <h3 className="font-nunito font-bold text-neutral-800">
                    Stage {stage.id}: {stage.title}
                  </h3>
                  {stage.isLocked && (
                    <span className="material-icons text-neutral-400 ml-2 text-sm">lock</span>
                  )}
                </div>
                <span className="text-sm text-neutral-600">
                  {stage.lessonsCompleted}/{stage.lessonsTotal} Lessons
                </span>
              </div>
              
              <ProgressBar value={stage.progressPercentage} className="mb-1" />
              
              <div className="text-xs text-neutral-500 text-right">
                {stage.progressPercentage}% Complete
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
          Your Stats
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="material-icons text-primary mb-1">school</span>
            <div className="text-2xl font-bold text-neutral-800">
              {user.completedLessons.length}
            </div>
            <div className="text-xs text-neutral-500">Lessons Completed</div>
          </div>
          
          <div className="bg-neutral-100 rounded-lg p-3">
            <span className="material-icons text-secondary mb-1">emoji_events</span>
            <div className="text-2xl font-bold text-neutral-800">
              {user.earnedBadges.length}
            </div>
            <div className="text-xs text-neutral-500">Badges Earned</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
