import { Lesson, Stage } from "@/lib/types";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

class LessonService {
  async getStages(): Promise<Stage[]> {
    try {
      // First check local storage
      const localStages = localStorage.getItem(LOCAL_STORAGE_KEYS.STAGES);
      if (localStages) {
        return JSON.parse(localStages);
      }

      // If not in local storage, fetch from API
      const response = await fetch('/api/stages');
      const stages = await response.json();
      
      // Save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEYS.STAGES, JSON.stringify(stages));
      
      return stages;
    } catch (error) {
      console.error('Error fetching stages:', error);
      return [];
    }
  }
  
  async getStageById(stageId: number): Promise<Stage | undefined> {
    const stages = await this.getStages();
    return stages.find(stage => stage.id === stageId);
  }
  
  async getLessonById(stageId: number, lessonId: number): Promise<Lesson | undefined> {
    const stage = await this.getStageById(stageId);
    if (!stage) return undefined;
    
    return stage.lessons.find(lesson => lesson.id === lessonId);
  }
  
  updateLessonProgress(completedLessons: any[], xpEarned: number): void {
    // This method will be used to update user progress in UserContext
    // It's a placeholder that will be implemented in userService
  }
}

export const lessonService = new LessonService();
