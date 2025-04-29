import { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, AlertCircle, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadFormProps {
  onUploadSuccess?: (data: any) => void;
}

export default function FileUploadForm({ onUploadSuccess }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [stageId, setStageId] = useState<string>('1');  // Default to Stage 1
  const [lessonId, setLessonId] = useState<string>('1');  // Default to Lesson 1
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      // Try to parse filename if it matches our pattern
      const filenamePattern = /^lesson_(\d+)_(\d+)\.\w+$/;
      const match = selectedFile.name.match(filenamePattern);
      
      if (match) {
        setStageId(match[1]);
        setLessonId(match[2]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setUploadError('Please select a file');
      return;
    }
    
    // If the filename doesn't match the expected pattern, rename it
    let fileToUpload = file;
    if (!file.name.match(/^lesson_\d+_\d+\.\w+$/)) {
      const fileExtension = file.name.split('.').pop();
      const newFilename = `lesson_${stageId}_${lessonId}.${fileExtension}`;
      
      // Create a new File object with the correct name
      fileToUpload = new File([file], newFilename, { type: file.type });
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      setUploadSuccess(true);
      
      toast({
        title: 'Upload Successful',
        description: `File ${data.file.filename} has been uploaded successfully.`,
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error: any) {
      setUploadError(error.message || 'An unknown error occurred');
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An unknown error occurred',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Lesson Media</CardTitle>
        <CardDescription>
          Upload audio, video, or image files for lessons. Files will be automatically associated with 
          the correct lesson based on the filename (lesson_[stageId]_[lessonId])
        </CardDescription>
      </CardHeader>
      <CardContent>
        {uploadSuccess ? (
          <Alert className="mb-4">
            <Check className="h-4 w-4" />
            <AlertTitle>Upload Successful</AlertTitle>
            <AlertDescription>
              Your file has been uploaded successfully.
            </AlertDescription>
          </Alert>
        ) : uploadError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        ) : null}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input 
                ref={fileInputRef}
                id="file" 
                type="file" 
                accept="audio/*,video/*,image/*" 
                onChange={handleFileChange}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: MP3, MP4, JPEG, PNG, GIF
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stageId">Stage ID</Label>
                <Input 
                  id="stageId" 
                  type="number" 
                  value={stageId} 
                  onChange={(e) => setStageId(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lessonId">Lesson ID</Label>
                <Input 
                  id="lessonId" 
                  type="number" 
                  value={lessonId} 
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="fileType">File Type</Label>
              <Select disabled={!file}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Auto-detected from file" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                File type is automatically detected from the uploaded file
              </p>
            </div>
            
            {file && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium">Selected File</h4>
                <p className="text-sm">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              {(file || uploadSuccess) && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              )}
              <Button type="submit" disabled={isUploading || !file || !stageId || !lessonId}>
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Maximum file size: 50MB. Files are automatically organized by type.
      </CardFooter>
    </Card>
  );
}