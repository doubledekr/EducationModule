import { useState, useRef, useEffect } from 'react';
import { AudioBlock } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioProps {
  audio: AudioBlock;
  onComplete?: () => void;
}

export default function Audio({ audio, onComplete }: AudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update progress as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onComplete) {
        onComplete();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{audio.audioTitle || 'Lesson Audio'}</h3>
        {audio.transcript && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </Button>
        )}
      </div>

      <audio ref={audioRef} src={audio.audioUrl} preload="metadata" className="hidden" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || (audio.audioDuration || 0))}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button variant="outline" size="icon" onClick={skipBackward}>
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={togglePlayPause} 
          className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={skipForward}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {showTranscript && audio.transcript && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium mb-2">Transcript</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{audio.transcript}</p>
        </div>
      )}
    </div>
  );
}