import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { Stage, Lesson } from "@/lib/types";
import { lessonService } from "@/services/lessonService";

interface LessonContextType {
  stages: Stage[];
  loading: boolean;
  getStageById: (stageId: number) => Stage | undefined;
  getLessonById: (stageId: number, lessonId: number) => Lesson | undefined;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function loadStages() {
      try {
        setLoading(true);
        const stagesData = await lessonService.getStages();
        setStages(stagesData);
      } catch (error) {
        console.error("Failed to load stages:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStages();
  }, []);
  
  const getStageById = (stageId: number): Stage | undefined => {
    return stages.find(stage => stage.id === stageId);
  };
  
  const getLessonById = (stageId: number, lessonId: number): Lesson | undefined => {
    const stage = getStageById(stageId);
    if (!stage) return undefined;
    
    return stage.lessons.find(lesson => lesson.id === lessonId);
  };
  
  return (
    <LessonContext.Provider 
      value={{ 
        stages, 
        loading, 
        getStageById, 
        getLessonById 
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessons must be used within a LessonProvider");
  }
  return context;
}
