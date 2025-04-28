import { useState, useRef, useEffect } from 'react';
import { VideoBlock } from '@/lib/types';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

interface VideoProps {
  video: VideoBlock;
  onComplete?: () => void;
}

export default function Video({ video, onComplete }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      
      // Mark as watched when 90% complete
      if (currentProgress > 90 && !hasWatched) {
        setHasWatched(true);
        if (onComplete) {
          onComplete();
        }
      }
    }
  };
  
  // This effect prevents autoplay on load and sets up event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);
  
  return (
    <div className="mb-6 bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Video thumbnail with play button or actual video */}
      <div className="relative aspect-video bg-neutral-900">
        {video.thumbnailUrl && !isPlaying ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title || "Video thumbnail"} 
            className="w-full h-full object-cover"
          />
        ) : null}
        
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          poster={video.thumbnailUrl}
          controls={isPlaying}
          onEnded={() => {
            setIsPlaying(false);
            setHasWatched(true);
            if (onComplete) onComplete();
          }}
        />
        
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlay}
          >
            <div className="bg-primary/80 h-16 w-16 rounded-full flex items-center justify-center shadow-lg">
              <PlayCircle className="h-10 w-10 text-white" />
            </div>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
          <div 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Video info */}
      <div className="p-4">
        {video.title && (
          <h3 className="font-nunito font-bold text-lg mb-1">{video.title}</h3>
        )}
        
        {video.description && (
          <p className="text-neutral-600 text-sm mb-2">{video.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDuration(video.duration)}</span>
          </div>
          
          {hasWatched && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span>Watched</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}