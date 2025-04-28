import { User, CompletedLesson, Badge } from "@/lib/types";
import { LOCAL_STORAGE_KEYS, INITIAL_USER, BADGES } from "@/lib/constants";
import { calculateStreakDays } from "@/lib/utils";

class UserService {
  getUser(): User {
    try {
      const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (userData) {
        return JSON.parse(userData);
      }
      // Initialize with default user if none exists
      this.saveUser(INITIAL_USER);
      return INITIAL_USER;
    } catch (error) {
      console.error('Error getting user data:', error);
      this.saveUser(INITIAL_USER);
      return INITIAL_USER;
    }
  }
  
  saveUser(user: User): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  }
  
  updateXP(xpToAdd: number): User {
    const user = this.getUser();
    const updatedUser = {
      ...user,
      xp: user.xp + xpToAdd
    };
    
    this.saveUser(updatedUser);
    this.checkForNewBadges(updatedUser);
    return updatedUser;
  }
  
  addCompletedLesson(lesson: CompletedLesson): User {
    const user = this.getUser();
    
    // Check if lesson is already completed
    const existingIndex = user.completedLessons.findIndex(
      l => l.stageId === lesson.stageId && l.lessonId === lesson.lessonId
    );
    
    let updatedCompletedLessons = [...user.completedLessons];
    
    if (existingIndex >= 0) {
      // Replace the existing entry
      updatedCompletedLessons[existingIndex] = lesson;
    } else {
      // Add new entry
      updatedCompletedLessons.push(lesson);
    }
    
    const updatedUser = {
      ...user,
      completedLessons: updatedCompletedLessons,
      xp: user.xp + lesson.xpEarned
    };
    
    this.saveUser(updatedUser);
    this.checkForNewBadges(updatedUser);
    return updatedUser;
  }
  
  updateLoginStreak(date: string): User {
    const user = this.getUser();
    
    // Check if today's date is already recorded
    if (!user.loginDates.includes(date)) {
      const updatedLoginDates = [...user.loginDates, date];
      const streakDays = calculateStreakDays(updatedLoginDates);
      
      const updatedUser = {
        ...user,
        loginDates: updatedLoginDates,
        streakDays
      };
      
      this.saveUser(updatedUser);
      this.checkForNewBadges(updatedUser);
      return updatedUser;
    }
    
    return user;
  }
  
  addBadge(badgeId: string): User {
    const user = this.getUser();
    
    if (user.earnedBadges.includes(badgeId)) {
      return user; // Badge already earned
    }
    
    const updatedUser = {
      ...user,
      earnedBadges: [...user.earnedBadges, badgeId]
    };
    
    this.saveUser(updatedUser);
    return updatedUser;
  }
  
  checkForNewBadges(user: User): void {
    const badgesToCheck = BADGES.filter(badge => !user.earnedBadges.includes(badge.id));
    
    for (const badge of badgesToCheck) {
      if (!badge.requirements) continue;
      
      let shouldAwardBadge = false;
      
      switch (badge.requirements.type) {
        case 'lessons_completed':
          shouldAwardBadge = user.completedLessons.length >= badge.requirements.threshold;
          break;
          
        case 'streak':
          shouldAwardBadge = user.streakDays >= badge.requirements.threshold;
          break;
          
        case 'xp_earned':
          shouldAwardBadge = user.xp >= badge.requirements.threshold;
          break;
          
        case 'quiz_score':
          if (badge.requirements.specificStage) {
            // Check for perfect score in specific stage
            const stageCompletedLessons = user.completedLessons.filter(
              l => l.stageId === badge.requirements?.specificStage
            );
            const allPerfectScore = stageCompletedLessons.every(l => l.score === 100);
            shouldAwardBadge = allPerfectScore && stageCompletedLessons.length > 0;
          }
          break;
      }
      
      if (shouldAwardBadge) {
        this.addBadge(badge.id);
      }
    }
  }
  
  getEarnedBadges(): Badge[] {
    const user = this.getUser();
    return BADGES.filter(badge => user.earnedBadges.includes(badge.id));
  }
  
  getLockedBadges(): Badge[] {
    const user = this.getUser();
    return BADGES.filter(badge => !user.earnedBadges.includes(badge.id));
  }
}

export const userService = new UserService();
