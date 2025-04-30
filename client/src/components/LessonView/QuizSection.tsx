import { useState } from 'react';
import { Lesson, LessonContent } from '@/lib/types';
import MultipleChoice from './MultipleChoice';
import SortingActivity from './SortingActivity';
import TapToReveal from './TapToReveal';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface QuizSectionProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
}

export default function QuizSection({ lesson, onComplete }: QuizSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);

  // Filter out only interactive quiz components
  const quizContent = lesson.content.filter(content => 
    content.type === 'multiple-choice' || 
    content.type === 'true-false' || 
    content.type === 'sorting'
  );

  const totalSteps = quizContent.length;
  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 100;

  const calculateScore = () => {
    if (totalSteps === 0) return 100; // Perfect score if no questions
    
    const correctAnswers = Object.values(answers).filter(answer => answer === true).length;
    return Math.round((correctAnswers / totalSteps) * 100);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    const finalScore = calculateScore();
    onComplete(finalScore);
  };

  const renderQuizItem = (content: LessonContent, index: number) => {
    switch (content.type) {
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
        
      default:
        return null;
    }
  };

  if (totalSteps === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
        <h3 className="font-bold text-lg mb-3">No Quiz Questions Found</h3>
        <p className="text-neutral-600 mb-4">This lesson doesn't have any quiz questions.</p>
        <Button onClick={() => onComplete(100)}>Complete Lesson</Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h3 className="font-bold text-lg mb-1">Quiz Completed!</h3>
        <p className="text-neutral-600 mb-4">You scored {score}% on this quiz</p>
        
        <div className="w-full h-4 bg-neutral-100 rounded-full mb-6">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        
        <Button onClick={handleComplete} className="w-full">
          Complete Lesson
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">Knowledge Check</h3>
        <p className="text-sm text-neutral-600">Question {currentStep + 1} of {totalSteps}</p>
        
        <div className="w-full h-1 bg-neutral-100 rounded-full mt-4">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-4">
        {renderQuizItem(quizContent[currentStep], currentStep)}
        
        <div className="mt-6">
          <Button 
            onClick={handleNext}
            className="w-full"
            disabled={!(currentStep in answers)}
          >
            {currentStep < totalSteps - 1 ? (
              <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              'View Results'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}