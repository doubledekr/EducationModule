import { LessonContent } from './types';
import { getAudioPath } from './utils';

/**
 * Creates an audio block for a lesson
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @param title - Optional title for the audio
 * @param transcript - Optional transcript of the audio content
 * @param duration - Optional duration in seconds
 * @returns An audio block content item
 */
export function createAudioBlock(
  stageId: number, 
  lessonId: number, 
  title?: string,
  transcript?: string,
  duration?: number
): LessonContent {
  return {
    type: 'audio',
    audioUrl: getAudioPath(stageId, lessonId),
    audioTitle: title || `Lesson ${stageId}.${lessonId} Audio`,
    transcript,
    audioDuration: duration
  };
}

/**
 * Adds an audio introduction to the beginning of a lesson's content
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @param content - The existing lesson content
 * @param title - Optional title for the audio
 * @param transcript - Optional transcript of the audio content
 * @param duration - Optional duration in seconds
 * @returns Updated content array with audio at the beginning
 */
export function addAudioToLesson(
  stageId: number,
  lessonId: number,
  content: LessonContent[],
  title?: string,
  transcript?: string,
  duration?: number
): LessonContent[] {
  const audioBlock = createAudioBlock(stageId, lessonId, title, transcript, duration);
  
  // Check if there's already an audio block at the beginning
  if (content.length > 0 && content[0].type === 'audio') {
    // Replace the existing audio block
    return [audioBlock, ...content.slice(1)];
  }
  
  // Add the audio block at the beginning
  return [audioBlock, ...content];
}