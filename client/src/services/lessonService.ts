import { Lesson, Stage } from "@/lib/types";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

class LessonService {
  async getStages(): Promise<Stage[]> {
    try {
      // Always fetch the latest data from the API
      const response = await fetch('/api/stages');
      const stages = await response.json() as Stage[];
      
      // Sort stages by ID to ensure consistent order
      const sortedStages = [...stages].sort((a, b) => a.id - b.id);
      
      // Save to local storage for offline use
      localStorage.setItem(LOCAL_STORAGE_KEYS.STAGES, JSON.stringify(sortedStages));
      
      return sortedStages;
    } catch (error) {
      // Only if API call fails, try to use cached data
      console.error('Error fetching stages:', error);
      const localStages = localStorage.getItem(LOCAL_STORAGE_KEYS.STAGES);
      if (localStages) {
        return JSON.parse(localStages);
      }
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
