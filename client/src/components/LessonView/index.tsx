import { useState } from "react";
import { Lesson, LessonContent } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { getToday } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { X, Bolt, BookOpen, MessageCircle, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Audio from "./Audio";
import Video from "./Video";
import ChatAgent from "./ChatAgent";
import QuizSection from "./QuizSection";
import TapToReveal from "./TapToReveal";

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
  const [activeTab, setActiveTab] = useState("lesson");
  
  // Find the first audio or video content
  const audioContent = lesson.content.find(item => item.type === 'audio');
  const videoContent = lesson.content.find(item => item.type === 'video');
  
  // Get all text content for the lesson tab
  const textContent = lesson.content.filter(item => 
    item.type === 'text' || 
    item.type === 'tap-to-reveal' || 
    item.type === 'image'
  );
  
  const handleQuizComplete = (quizScore: number) => {
    // Record completion
    addCompletedLesson({
      stageId,
      lessonId: lesson.id,
      completedAt: getToday(),
      score: quizScore,
      xpEarned: lesson.xpReward
    });
    
    toast({
      title: "Lesson completed!",
      description: `You earned ${lesson.xpReward} XP. Score: ${quizScore}%`,
    });
    
    onComplete();
  };
  
  // Render a text content item
  const renderTextContent = (content: LessonContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="mb-6" key={`text-${index}`}>
            {content.title && <h3 className="font-nunito font-bold text-lg mb-2">{content.title}</h3>}
            <p className="text-neutral-700 mb-4">{content.content}</p>
          </div>
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
        
      case 'tap-to-reveal':
        return (
          <TapToReveal 
            key={`reveal-${index}`}
            title={content.title} 
            hiddenContent={content.hiddenContent} 
          />
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
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <h2 className="font-nunito font-bold">{lesson.title}</h2>
            <div className="text-xs text-neutral-500">Lesson {lesson.id} of 8</div>
          </div>
          <div className="flex items-center space-x-1">
            <Bolt className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold">{lesson.xpReward} XP</span>
          </div>
        </div>
        
        {/* Media Section - Always visible at the top */}
        <div className="p-4 border-b border-neutral-100">
          {audioContent && audioContent.type === 'audio' && (
            <Audio 
              audio={audioContent}
              onComplete={() => {
                // Nothing to do, we just want to track that it was played
              }}
            />
          )}
          
          {!audioContent && videoContent && videoContent.type === 'video' && (
            <Video 
              video={videoContent}
              onComplete={() => {
                // Nothing to do, we just want to track that it was played
              }}
            />
          )}
          
          {!audioContent && !videoContent && (
            <div className="p-4 bg-neutral-50 rounded-lg text-center">
              <p className="text-neutral-600">No audio or video content available for this lesson.</p>
            </div>
          )}
        </div>
        
        {/* Tabbed Interface */}
        <div className="p-4">
          <Tabs defaultValue="lesson" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="lesson" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Lesson</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>Ask Questions</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                <span>Quiz</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lesson" className="space-y-4">
              <div className="space-y-4">
                {textContent.map((content, index) => renderTextContent(content, index))}
              </div>
            </TabsContent>
            
            <TabsContent value="chat">
              <ChatAgent lesson={lesson} />
            </TabsContent>
            
            <TabsContent value="quiz">
              <QuizSection lesson={lesson} onComplete={handleQuizComplete} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
