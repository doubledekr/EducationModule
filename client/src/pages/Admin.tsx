import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, FileAudio, FileVideo, Image } from 'lucide-react';
import FileUploadForm from '@/components/FileUploadForm';

interface Upload {
  timestamp: string;
  fileType: string;
  filename: string;
  stageId: number | null;
  lessonId: number | null;
  status: string;
}

export default function AdminPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const fetchUploads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/uploads');
      if (!response.ok) {
        throw new Error('Failed to fetch uploads');
      }
      const data = await response.json();
      setUploads(data);
      setFilteredUploads(data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  useEffect(() => {
    let filtered = uploads;
    
    // Filter by search term
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filtered = filtered.filter(upload => 
        upload.filename.toLowerCase().includes(searchTerm) ||
        upload.status.toLowerCase().includes(searchTerm) ||
        upload.fileType.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by stage
    if (selectedStage !== null) {
      filtered = filtered.filter(upload => upload.stageId === selectedStage);
    }
    
    // Filter by lesson
    if (selectedLesson !== null) {
      filtered = filtered.filter(upload => upload.lessonId === selectedLesson);
    }
    
    setFilteredUploads(filtered);
  }, [filter, selectedStage, selectedLesson, uploads]);

  // Get unique stage IDs
  const stageIds = [...new Set(uploads.map(upload => upload.stageId).filter(Boolean))];
  
  // Get unique lesson IDs for the selected stage
  const lessonIds = selectedStage 
    ? [...new Set(uploads
        .filter(upload => upload.stageId === selectedStage)
        .map(upload => upload.lessonId)
        .filter(Boolean))]
    : [];

  const handleUploadSuccess = (data: any) => {
    fetchUploads();
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio':
        return <FileAudio className="h-4 w-4" />;
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchUploads} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="uploads">
        <TabsList>
          <TabsTrigger value="uploads">Media Uploads</TabsTrigger>
          <TabsTrigger value="upload-new">Upload New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                Manage uploaded media files for lessons. Filter by stage, lesson, or filename.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <Label htmlFor="filter">Search</Label>
                    <Input
                      id="filter"
                      placeholder="Search by filename or status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stage">Stage</Label>
                    <select
                      id="stage"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedStage === null ? '' : selectedStage}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        setSelectedStage(value);
                        setSelectedLesson(null);
                      }}
                    >
                      <option value="">All Stages</option>
                      {stageIds.map((stageId) => (
                        <option key={`stage-${stageId}`} value={stageId}>
                          Stage {stageId}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="lesson">Lesson</Label>
                    <select
                      id="lesson"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedLesson === null ? '' : selectedLesson}
                      onChange={(e) => setSelectedLesson(e.target.value === '' ? null : Number(e.target.value))}
                      disabled={selectedStage === null}
                    >
                      <option value="">All Lessons</option>
                      {lessonIds.map((lessonId) => (
                        <option key={`lesson-${lessonId}`} value={lessonId}>
                          Lesson {lessonId}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUploads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            {isLoading ? 'Loading...' : 'No uploads found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUploads.map((upload, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {upload.filename}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getFileIcon(upload.fileType)}
                                <span className="ml-2 capitalize">{upload.fileType}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {upload.stageId ? `Stage ${upload.stageId}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {upload.lessonId ? `Lesson ${upload.lessonId}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={upload.status.includes('ERROR') ? 'destructive' : 'default'}>
                                {upload.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(upload.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <a
                                href={`/api/media/${upload.fileType}/${upload.filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload-new">
          <FileUploadForm onUploadSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
}