import { Lesson } from "@/lib/types";
import { useLocation } from "wouter";

interface LessonCardProps {
  stageId: number;
  lesson: Lesson;
  isCompleted: boolean;
  isCurrentLesson: boolean;
  isCheckpointQuiz?: boolean;
}

export default function LessonCard({ 
  stageId, 
  lesson, 
  isCompleted, 
  isCurrentLesson,
  isCheckpointQuiz = false
}: LessonCardProps) {
  const [, setLocation] = useLocation();
  
  const handleCardClick = () => {
    if (!lesson.isLocked) {
      setLocation(`/lesson/${stageId}/${lesson.id}`);
    }
  };
  
  // Determine card styling based on lesson state
  const cardStyle = isCurrentLesson 
    ? "lesson-card relative z-10 bg-white rounded-xl shadow-sm overflow-hidden flex border-2 border-primary pulse-animation" 
    : "lesson-card relative z-10 bg-white rounded-xl shadow-sm overflow-hidden flex";
  
  // Determine left border color
  const borderColorClass = isCompleted 
    ? "bg-success" 
    : isCurrentLesson 
      ? "bg-primary" 
      : "bg-neutral-300";
  
  // Status indicator (check mark, play button, or lock)
  const StatusIndicator = () => {
    if (isCompleted) {
      return (
        <div className="bg-success/10 h-8 w-8 rounded-full flex items-center justify-center">
          <span className="material-icons text-success text-sm">check</span>
        </div>
      );
    } else if (!lesson.isLocked) {
      return (
        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
          <span className="material-icons text-primary text-sm">play_arrow</span>
        </div>
      );
    } else {
      return (
        <div className="bg-neutral-200 h-8 w-8 rounded-full flex items-center justify-center">
          <span className="material-icons text-neutral-400 text-sm">lock</span>
        </div>
      );
    }
  };
  
  // Button for continuing or reviewing
  const ActionButton = () => {
    if (lesson.isLocked) return null;
    
    if (isCompleted) {
      return (
        <button 
          onClick={handleCardClick}
          className="text-xs font-medium text-primary"
        >
          Review
        </button>
      );
    }
    
    return (
      <button 
        onClick={handleCardClick}
        className="text-xs font-medium text-white bg-primary rounded-full px-3 py-1.5"
      >
        {isCurrentLesson ? "Continue" : "Start"}
      </button>
    );
  };
  
  return (
    <div 
      className={`${cardStyle} ${lesson.isLocked ? "opacity-70" : ""}`}
      onClick={lesson.isLocked ? undefined : handleCardClick}
    >
      <div className={`w-2 ${borderColorClass} h-full`}></div>
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              {isCheckpointQuiz && (
                <span className="material-icons text-accent mr-1">quiz</span>
              )}
              <h3 className={`font-nunito font-bold ${lesson.isLocked ? "text-neutral-600" : "text-neutral-800"}`}>
                {lesson.id}. {lesson.title}
              </h3>
              {isCurrentLesson && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded ml-2">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">{lesson.description}</p>
          </div>
          <StatusIndicator />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className={`flex items-center ${lesson.isLocked ? "text-neutral-400" : "text-neutral-500"} text-xs`}>
            <span className="material-icons text-xs mr-1">schedule</span>
            <span>{lesson.duration} min</span>
            <span className="mx-2">•</span>
            <span className="material-icons text-xs mr-1">bolt</span>
            <span>+{lesson.xpReward} XP</span>
          </div>
          <ActionButton />
        </div>
      </div>
    </div>
  );
}
