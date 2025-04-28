import { LessonContent } from './types';
import { getAudioPath, getVideoPath } from './utils';

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

/**
 * Creates a video block for a lesson
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @param title - Optional title for the video
 * @param description - Optional description of the video content
 * @param thumbnailUrl - Optional URL to the video thumbnail
 * @param duration - Optional duration in seconds
 * @returns A video block content item
 */
export function createVideoBlock(
  stageId: number, 
  lessonId: number, 
  title?: string,
  description?: string,
  thumbnailUrl?: string,
  duration?: number
): LessonContent {
  return {
    type: 'video',
    videoUrl: getVideoPath(stageId, lessonId),
    title: title || `Lesson ${stageId}.${lessonId} Video`,
    description,
    thumbnailUrl,
    duration
  };
}

/**
 * Adds a video to a lesson's content
 * @param stageId - The stage ID
 * @param lessonId - The lesson ID
 * @param content - The existing lesson content
 * @param position - Position to insert the video (0 = beginning, undefined = end)
 * @param title - Optional title for the video
 * @param description - Optional description of the video content
 * @param thumbnailUrl - Optional URL to the video thumbnail
 * @param duration - Optional duration in seconds
 * @returns Updated content array with video added
 */
export function addVideoToLesson(
  stageId: number,
  lessonId: number,
  content: LessonContent[],
  position?: number,
  title?: string,
  description?: string,
  thumbnailUrl?: string,
  duration?: number
): LessonContent[] {
  const videoBlock = createVideoBlock(stageId, lessonId, title, description, thumbnailUrl, duration);
  
  // Insert at specified position
  if (position !== undefined) {
    return [
      ...content.slice(0, position),
      videoBlock,
      ...content.slice(position)
    ];
  }
  
  // Add to the end by default
  return [...content, videoBlock];
}