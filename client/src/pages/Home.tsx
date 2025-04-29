import MainLayout from "@/layouts/MainLayout";
import ProfileBanner from "@/components/ProfileBanner";
import BadgeDisplay from "@/components/BadgeDisplay";
import StageDisplay from "@/components/StageDisplay";
import LearningMaterials from "@/components/LearningMaterials";
import MediaPreview from "@/components/MediaPreview";
import { useUser } from "@/context/UserContext";
import { useLessons } from "@/context/LessonContext";
import { useState, useEffect } from "react";
import { RESOURCES } from "@/lib/constants";
import { userService } from "@/services/userService";

export default function Home() {
  const { user } = useUser();
  const { stages, loading } = useLessons();
  const [currentStage, setCurrentStage] = useState<any>(null);
  
  useEffect(() => {
    if (!loading && stages.length > 0) {
      // Find the current stage
      const stageIndex = stages.findIndex(stage => stage.id === user.currentStage);
      if (stageIndex >= 0) {
        setCurrentStage(stages[stageIndex]);
      } else {
        setCurrentStage(stages[0]);
      }
    }
  }, [loading, stages, user.currentStage]);
  
  const earnedBadges = userService.getEarnedBadges();
  const lockedBadges = userService.getLockedBadges();
  
  // Calculate stage progress
  const completedLessonsInStage = user.completedLessons.filter(
    lesson => lesson.stageId === user.currentStage
  ).length;
  
  const stageProgress = currentStage 
    ? Math.round((completedLessonsInStage / currentStage.lessons.length) * 100) 
    : 0;
  
  if (loading || !currentStage) {
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
      <ProfileBanner 
        user={user} 
        currentStage={user.currentStage}
        totalStages={stages.length}
        stageProgress={stageProgress}
      />
      
      <BadgeDisplay earnedBadges={earnedBadges} lockedBadges={lockedBadges} />
      
      <StageDisplay stage={currentStage} />
      
      <MediaPreview stageId={1} lessonId={1} />
      
      <LearningMaterials resources={RESOURCES} />
    </MainLayout>
  );
}
