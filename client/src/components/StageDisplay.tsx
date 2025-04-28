import { Stage } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import LessonCard from "./LessonCard";

interface StageDisplayProps {
  stage: Stage;
}

export default function StageDisplay({ stage }: StageDisplayProps) {
  const { user } = useUser();
  
  // Calculate how many lessons are completed
  const completedLessonsCount = user.completedLessons.filter(
    lesson => lesson.stageId === stage.id
  ).length;
  
  // Calculate stage progress percentage
  const stageProgress = Math.round((completedLessonsCount / stage.lessons.length) * 100);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-bold text-lg text-neutral-800">
          Stage {stage.id}: {stage.title}
        </h2>
        <div className="px-2 py-1 bg-primary/10 rounded-full">
          <span className="text-xs font-bold text-primary">
            {completedLessonsCount}/{stage.lessons.length} Complete
          </span>
        </div>
      </div>
      
      {/* Lesson Map */}
      <div className="relative">
        <div className="lesson-map-line"></div>
        
        <div className="space-y-4">
          {stage.lessons.map((lesson) => {
            // Check if the lesson is completed
            const isCompleted = user.completedLessons.some(
              completedLesson => 
                completedLesson.stageId === stage.id && 
                completedLesson.lessonId === lesson.id
            );
            
            // Check if it's the current lesson
            const isCurrentLesson = !isCompleted && !lesson.isLocked;
            
            // Check if the previous lesson is completed to determine if this one should be locked
            const lessonIndex = stage.lessons.findIndex(l => l.id === lesson.id);
            let shouldBeLocked = false;
            
            if (lessonIndex > 0) {
              const prevLesson = stage.lessons[lessonIndex - 1];
              shouldBeLocked = !user.completedLessons.some(
                completedLesson => 
                  completedLesson.stageId === stage.id && 
                  completedLesson.lessonId === prevLesson.id
              );
            }
            
            // If the lesson is already marked as locked or should be locked, mark it as locked
            const isLocked = lesson.isLocked || shouldBeLocked;
            
            // Special case for checkpoint quiz
            const isCheckpointQuiz = lesson.id === 6 && stage.id === 1;
            
            return (
              <LessonCard
                key={`${stage.id}-${lesson.id}`}
                stageId={stage.id}
                lesson={{
                  ...lesson,
                  isLocked: isLocked
                }}
                isCompleted={isCompleted}
                isCurrentLesson={isCurrentLesson}
                isCheckpointQuiz={isCheckpointQuiz}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
