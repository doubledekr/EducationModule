import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateXPLevelProgress(xp: number): {currentLevel: number, levelXP: number, nextLevelXP: number, progress: number} {
  // XP required for each level - increases with each level
  const levelRequirements = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
  
  let currentLevel = 1;
  
  // Find current level
  for (let i = 1; i < levelRequirements.length; i++) {
    if (xp >= levelRequirements[i]) {
      currentLevel = i;
    } else {
      break;
    }
  }
  
  const levelXP = xp - levelRequirements[currentLevel];
  const nextLevelXP = levelRequirements[currentLevel + 1] - levelRequirements[currentLevel];
  const progress = Math.min(100, Math.floor((levelXP / nextLevelXP) * 100));
  
  return {
    currentLevel,
    levelXP,
    nextLevelXP,
    progress
  };
}

export function getToday(): string {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function calculateStreakDays(loginDates: string[]): number {
  if (!loginDates.length) return 0;
  
  const sortedDates = [...loginDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getToday();
  
  // Check if user logged in today
  const hasLoggedInToday = sortedDates.some(date => isSameDay(date, today));
  if (!hasLoggedInToday) {
    // Check if user logged in yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
    
    const hasLoggedInYesterday = sortedDates.some(date => isSameDay(date, yesterdayString));
    if (!hasLoggedInYesterday) {
      return 0; // Streak broken
    }
  }
  
  let streak = hasLoggedInToday ? 1 : 0;
  let currentDate = new Date(today);
  
  if (!hasLoggedInToday) {
    currentDate = new Date(currentDate.getTime() - 86400000); // Go back one day
  }
  
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    if (sortedDates.some(date => isSameDay(date, dateString))) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Gets the audio file path for a specific lesson
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @returns The path to the audio file
 */
export function getAudioPath(stageId: number, lessonId: number): string {
  return `/api/media/audio/lesson_${stageId}_${lessonId}.mp3`;
}

/**
 * Gets the video file path for a specific lesson
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @returns The path to the video file
 */
export function getVideoPath(stageId: number, lessonId: number): string {
  return `/api/media/video/lesson_${stageId}_${lessonId}.mp4`;
}

/**
 * Gets the image file path
 * @param filename - The image filename
 * @returns The path to the image file
 */
export function getImagePath(filename: string): string {
  return `/api/media/images/${filename}`;
}

/**
 * Format duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted time string in MM:SS format
 */
export function formatAudioDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
