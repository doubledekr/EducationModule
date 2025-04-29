import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAudioPath, getVideoPath } from '@/lib/utils';

interface MediaPreviewProps {
  stageId?: number;
  lessonId?: number;
}

export default function MediaPreview({ stageId = 1, lessonId = 1 }: MediaPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioPath = getAudioPath(stageId, lessonId);
  const videoPath = getVideoPath(stageId, lessonId);
  
  const handleAudioPlay = () => {
    const audioElement = document.getElementById('preview-audio') as HTMLAudioElement;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Lesson Media Preview</CardTitle>
        <CardDescription>
          Test your uploaded media files for Stage {stageId}, Lesson {lessonId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="audio">
          <TabsList className="mb-4">
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio" className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Lesson {stageId}.{lessonId} Audio</h3>
              <audio 
                id="preview-audio"
                src={audioPath} 
                className="w-full" 
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Path: {audioPath}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Lesson {stageId}.{lessonId} Video</h3>
              <video 
                src={videoPath}
                className="w-full rounded-lg" 
                controls
                poster="https://via.placeholder.com/640x360.png?text=Video+Preview"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Path: {videoPath}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}