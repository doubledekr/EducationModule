import { useState } from "react";
import { Lesson, LessonContent, Question } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { getToday } from "@/lib/utils";
import TapToReveal from "./TapToReveal";
import MultipleChoice from "./MultipleChoice";
import SortingActivity from "./SortingActivity";
import { useToast } from "@/hooks/use-toast";

interface LessonViewProps {
  stageId: number;
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

export default function LessonView({ 
  stageId, 
  lesson, 
  onComplete,
  onClose 
}: LessonViewProps) {
  const { addCompletedLesson } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [score, setScore] = useState(0);
  
  const totalSteps = lesson.content.length;
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate score
      const totalQuestions = lesson.content.filter(
        content => content.type === 'multiple-choice' || content.type === 'true-false' || content.type === 'sorting'
      ).length;
      
      const correctAnswers = Object.values(answers).filter(answer => answer === true).length;
      const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
      
      setScore(finalScore);
      
      // Record completion
      addCompletedLesson({
        stageId,
        lessonId: lesson.id,
        completedAt: getToday(),
        score: finalScore,
        xpEarned: lesson.xpReward
      });
      
      toast({
        title: "Lesson completed!",
        description: `You earned ${lesson.xpReward} XP. Score: ${finalScore}%`,
      });
      
      onComplete();
    }
  };
  
  const renderContent = (content: LessonContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="mb-6" key={`text-${index}`}>
            {content.title && <h3 className="font-nunito font-bold text-lg mb-2">{content.title}</h3>}
            <p className="text-neutral-700 mb-4">{content.content}</p>
          </div>
        );
        
      case 'tap-to-reveal':
        return (
          <TapToReveal 
            key={`reveal-${index}`}
            title={content.title} 
            hiddenContent={content.hiddenContent} 
          />
        );
        
      case 'multiple-choice':
      case 'true-false':
        return (
          <MultipleChoice 
            key={`mc-${index}`}
            question={content.question} 
            multiSelect={content.type === 'multiple-choice' && content.multiSelect}
            onAnswer={(isCorrect) => {
              setAnswers({...answers, [index]: isCorrect});
            }}
          />
        );
        
      case 'sorting':
        return (
          <SortingActivity 
            key={`sort-${index}`}
            activity={content} 
            onComplete={(isCorrect) => {
              setAnswers({...answers, [index]: isCorrect});
            }}
          />
        );
        
      case 'image':
        return (
          <div className="mb-6" key={`image-${index}`}>
            <img 
              src={content.imageUrl} 
              alt={content.caption || "Lesson image"} 
              className="w-full rounded-lg mb-2" 
            />
            {content.caption && (
              <p className="text-sm text-neutral-500 text-center">{content.caption}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-neutral-900/80 z-50 overflow-y-auto">
      <div className="bg-white rounded-t-xl absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-neutral-200 flex items-center justify-between">
          <button 
            className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
          <div className="text-center">
            <h2 className="font-nunito font-bold">{lesson.title}</h2>
            <div className="text-xs text-neutral-500">Lesson {lesson.id} of 8</div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="material-icons text-sm text-accent">bolt</span>
            <span className="text-xs font-bold">{lesson.xpReward} XP</span>
          </div>
        </div>
        
        {/* Lesson Content */}
        <div className="p-4">
          {/* Progress Indicator */}
          <div className="w-full h-1 bg-neutral-200 rounded-full mb-6">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Current content step */}
          {currentStep < totalSteps && renderContent(lesson.content[currentStep], currentStep)}
          
          {/* Next Button */}
          <div className="pb-6 mt-6">
            <button 
              className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-sm"
              onClick={handleNext}
            >
              {currentStep < totalSteps - 1 ? "Continue" : "Mark Complete & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
