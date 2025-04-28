import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Define the uploads base directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directories exist
fs.ensureDirSync(path.join(UPLOADS_DIR, 'audio'));
fs.ensureDirSync(path.join(UPLOADS_DIR, 'video'));
fs.ensureDirSync(path.join(UPLOADS_DIR, 'images'));

// Create uploads log file if it doesn't exist
const UPLOADS_LOG_PATH = path.join(UPLOADS_DIR, 'uploads.log');
if (!fs.existsSync(UPLOADS_LOG_PATH)) {
  fs.writeFileSync(UPLOADS_LOG_PATH, 'Timestamp,FileType,Filename,StageID,LessonID,Status\n');
}

// Configure storage for multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the subdirectory based on mime type
    let uploadDir = UPLOADS_DIR;
    if (file.mimetype.startsWith('audio/')) {
      uploadDir = path.join(UPLOADS_DIR, 'audio');
    } else if (file.mimetype.startsWith('video/')) {
      uploadDir = path.join(UPLOADS_DIR, 'video');
    } else if (file.mimetype.startsWith('image/')) {
      uploadDir = path.join(UPLOADS_DIR, 'images');
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Preserve the original filename
    cb(null, file.originalname);
  }
});

// File type filter
const fileFilter = (req: any, file: any, cb: any) => {
  // Accept audio, video, and image files
  if (
    file.mimetype.startsWith('audio/') || 
    file.mimetype.startsWith('video/') || 
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only audio, video, and image files are allowed.'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Function to log file uploads
export const logFileUpload = (
  file: Express.Multer.File,
  stageId: number | null,
  lessonId: number | null,
  status: string
) => {
  const timestamp = new Date().toISOString();
  const fileType = file.mimetype.split('/')[0];
  const logEntry = `${timestamp},${fileType},${file.originalname},${stageId || 'N/A'},${lessonId || 'N/A'},${status}\n`;
  
  fs.appendFileSync(UPLOADS_LOG_PATH, logEntry);
  
  return { timestamp, fileType, filename: file.originalname, stageId, lessonId, status };
};

// Parse lesson info from filename
export const parseLessonInfoFromFilename = (filename: string) => {
  // Expected format: lesson_[stageId]_[lessonId].[ext]
  // Example: lesson_1_3.mp3
  const lessonPattern = /^lesson_(\d+)_(\d+)\.\w+$/;
  const match = filename.match(lessonPattern);
  
  if (match) {
    return {
      stageId: parseInt(match[1], 10),
      lessonId: parseInt(match[2], 10)
    };
  }
  
  return null;
};

// Handler for validating lesson exists
export const validateLessonExists = async (
  req: Request & { file?: Express.Multer.File }, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const lessonInfo = parseLessonInfoFromFilename(req.file.originalname);
  
  if (!lessonInfo) {
    // Log the upload without lesson info
    logFileUpload(req.file, null, null, 'ERROR: Invalid filename format');
    
    return res.status(400).json({ 
      message: 'Invalid filename format. Expected format: lesson_[stageId]_[lessonId].[ext]'
    });
  }
  
  try {
    // Check if the lesson exists
    const lesson = await storage.getLessonById(lessonInfo.stageId, lessonInfo.lessonId);
    
    if (!lesson) {
      logFileUpload(req.file, lessonInfo.stageId, lessonInfo.lessonId, 'ERROR: Lesson not found');
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Set the lesson info in the request for later use
    req.body.stageId = lessonInfo.stageId;
    req.body.lessonId = lessonInfo.lessonId;
    req.body.lesson = lesson;
    
    // Log successful validation
    logFileUpload(req.file, lessonInfo.stageId, lessonInfo.lessonId, 'Validated');
    
    next();
  } catch (error: any) {
    console.error('Error validating lesson:', error);
    const errorMessage = error.message || 'Unknown error';
    logFileUpload(req.file, lessonInfo.stageId, lessonInfo.lessonId, `ERROR: ${errorMessage}`);
    res.status(500).json({ message: 'Error validating lesson' });
  }
};

// Get all file uploads from the log
export const getFileUploads = () => {
  try {
    const logContent = fs.readFileSync(UPLOADS_LOG_PATH, 'utf8');
    const lines = logContent.split('\n').filter((line: string) => line.trim() !== '');
    
    // Skip the header line
    const entries = lines.slice(1).map((line: string) => {
      const [timestamp, fileType, filename, stageId, lessonId, status] = line.split(',');
      return {
        timestamp,
        fileType,
        filename,
        stageId: stageId !== 'N/A' ? parseInt(stageId, 10) : null,
        lessonId: lessonId !== 'N/A' ? parseInt(lessonId, 10) : null,
        status
      };
    });
    
    return entries;
  } catch (error) {
    console.error('Error reading uploads log:', error);
    return [];
  }
};

// Get file uploads for a specific lesson
export const getLessonUploads = (stageId: number, lessonId: number) => {
  const allUploads = getFileUploads();
  return allUploads.filter(
    (upload: any) => upload.stageId === stageId && upload.lessonId === lessonId
  );
};