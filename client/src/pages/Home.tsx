import MainLayout from "@/layouts/MainLayout";
import ProfileBanner from "@/components/ProfileBanner";
import BadgeDisplay from "@/components/BadgeDisplay";
import StageDisplay from "@/components/StageDisplay";
import LearningMaterials from "@/components/LearningMaterials";
import { useUser } from "@/context/UserContext";
import { useLessons } from "@/context/LessonContext";
import { useState, useEffect } from "react";
import { RESOURCES } from "@/lib/constants";
import { userService } from "@/services/userService";
import { Stage } from "@/lib/types";

export default function Home() {
  const { user } = useUser();
  const { stages, loading } = useLessons();
  const [currentStage, setCurrentStage] = useState<any>(null);
  
  // For this component, we want to display both stages
  const [sortedStages, setSortedStages] = useState<Stage[]>([]);

  useEffect(() => {
    if (!loading && stages.length > 0) {
      // Sort stages by ID to ensure consistent order
      const sorted = [...stages].sort((a, b) => a.id - b.id);
      setSortedStages(sorted);
      
      // Find the current stage for the user
      const stageIndex = sorted.findIndex(stage => stage.id === user.currentStage);
      if (stageIndex >= 0) {
        setCurrentStage(sorted[stageIndex]);
      } else {
        setCurrentStage(sorted[0]);
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
      
      {/* Display all stages */}
      <div className="mb-8">
        <h2 className="font-nunito font-bold text-xl text-primary mb-4">Your Learning Path</h2>
      </div>
      
      {sortedStages.map(stage => (
        <StageDisplay key={stage.id} stage={stage} />
      ))}
      
      <LearningMaterials resources={RESOURCES} />
    </MainLayout>
  );
}
