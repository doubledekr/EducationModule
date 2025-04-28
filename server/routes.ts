import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { 
  upload, 
  validateLessonExists, 
  logFileUpload, 
  getFileUploads,
  getLessonUploads,
  parseLessonInfoFromFilename
} from "./upload-handler";

// Extend Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      body: {
        stageId?: number;
        lessonId?: number;
        lesson?: any;
      }
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  app.get("/api/stages", async (req, res) => {
    try {
      const stages = await storage.getStages();
      res.json(stages);
    } catch (error) {
      console.error("Error fetching stages:", error);
      res.status(500).json({ message: "Failed to fetch stages" });
    }
  });

  app.get("/api/stages/:stageId", async (req, res) => {
    try {
      const stageId = parseInt(req.params.stageId);
      const stage = await storage.getStageById(stageId);
      
      if (!stage) {
        return res.status(404).json({ message: "Stage not found" });
      }
      
      res.json(stage);
    } catch (error) {
      console.error("Error fetching stage:", error);
      res.status(500).json({ message: "Failed to fetch stage" });
    }
  });

  app.get("/api/stages/:stageId/lessons/:lessonId", async (req, res) => {
    try {
      const stageId = parseInt(req.params.stageId);
      const lessonId = parseInt(req.params.lessonId);
      
      const lesson = await storage.getLessonById(stageId, lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // File upload endpoints
  
  // Upload a file for a lesson
  app.post("/api/uploads", upload.single('file'), validateLessonExists, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const stageId = req.body.stageId;
      const lessonId = req.body.lessonId;
      const lesson = req.body.lesson;
      
      // Log successful upload
      const logEntry = logFileUpload(req.file, stageId, lessonId, 'UPLOADED');
      
      // Return success response with file info
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        },
        lesson: {
          stageId,
          lessonId,
          title: lesson.title
        },
        log: logEntry
      });
    } catch (error) {
      console.error("Error processing upload:", error);
      res.status(500).json({ message: "Failed to process upload" });
    }
  });

  // Get all uploaded files
  app.get("/api/uploads", async (req, res) => {
    try {
      const uploads = getFileUploads();
      res.json(uploads);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      res.status(500).json({ message: "Failed to fetch uploads" });
    }
  });

  // Get uploads for a specific lesson
  app.get("/api/stages/:stageId/lessons/:lessonId/uploads", async (req, res) => {
    try {
      const stageId = parseInt(req.params.stageId);
      const lessonId = parseInt(req.params.lessonId);
      
      // Check if the lesson exists
      const lesson = await storage.getLessonById(stageId, lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      const uploads = getLessonUploads(stageId, lessonId);
      
      res.json({
        lesson: {
          stageId,
          lessonId,
          title: lesson.title
        },
        uploads
      });
    } catch (error) {
      console.error("Error fetching lesson uploads:", error);
      res.status(500).json({ message: "Failed to fetch lesson uploads" });
    }
  });

  // Serve uploaded files
  app.get("/api/media/:type/:filename", (req, res) => {
    try {
      const type = req.params.type;
      const filename = req.params.filename;
      
      // Validate type parameter
      if (!['audio', 'video', 'images'].includes(type)) {
        return res.status(400).json({ message: "Invalid media type" });
      }
      
      // Construct file path
      const filePath = path.join(process.cwd(), 'uploads', type, filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Determine content type
      let contentType = 'application/octet-stream';
      if (type === 'audio') contentType = 'audio/mpeg';
      if (type === 'video') contentType = 'video/mp4';
      if (type === 'images') {
        const ext = path.extname(filename).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.svg') contentType = 'image/svg+xml';
      }
      
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error serving media file:", error);
      res.status(500).json({ message: "Failed to serve media file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
