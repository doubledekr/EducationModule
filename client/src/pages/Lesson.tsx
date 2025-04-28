import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import LessonView from "@/components/LessonView";
import { useLessons } from "@/context/LessonContext";

export default function Lesson() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/lesson/:stageId/:lessonId");
  const { stages, loading, getLessonById } = useLessons();
  const [lessonData, setLessonData] = useState<any>(null);
  const [showLessonView, setShowLessonView] = useState(true);
  
  useEffect(() => {
    if (!loading && match && params) {
      const stageId = parseInt(params.stageId);
      const lessonId = parseInt(params.lessonId);
      
      const lesson = getLessonById(stageId, lessonId);
      if (lesson) {
        setLessonData({
          stageId,
          lesson
        });
      } else {
        // Lesson not found, redirect to home
        setLocation("/");
      }
    }
  }, [loading, match, params, setLocation, getLessonById]);
  
  const handleCompleteLesson = () => {
    setShowLessonView(false);
    setLocation("/");
  };
  
  const handleCloseLesson = () => {
    setShowLessonView(false);
    setLocation("/");
  };
  
  if (loading || !lessonData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-icons animate-spin text-primary text-2xl">refresh</span>
            <p className="mt-2 text-neutral-600">Loading lesson...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-neutral-600">Loading lesson content...</p>
        </div>
      </div>
      
      {showLessonView && (
        <LessonView 
          stageId={lessonData.stageId}
          lesson={lessonData.lesson}
          onComplete={handleCompleteLesson}
          onClose={handleCloseLesson}
        />
      )}
    </MainLayout>
  );
}
