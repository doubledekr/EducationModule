import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

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

  const httpServer = createServer(app);

  return httpServer;
}
