import { InsertUser, User, LessonContent, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Define types for our storage interface
export interface Stage {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  requiredXP: number;
  checkpointQuiz?: Quiz;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  xpReward: number;
  content: LessonContent[];
  quiz?: Quiz;
  isLocked?: boolean;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string | string[] | number[];
  explanation?: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  xpReward: number;
  duration: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getStages(): Promise<Stage[]>;
  getStageById(id: number): Promise<Stage | undefined>;
  getLessonById(stageId: number, lessonId: number): Promise<Lesson | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stages: Stage[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.stages = [];
    this.currentId = 1;
    this.loadStages();
  }

  private loadStages() {
    try {
      // Load stages from JSON file
      const stagesPath = path.join(process.cwd(), 'data', 'stages.json');
      
      if (fs.existsSync(stagesPath)) {
        const stagesData = fs.readFileSync(stagesPath, 'utf8');
        this.stages = JSON.parse(stagesData);
      } else {
        console.warn("stages.json file not found, using empty stages array");
      }
    } catch (error) {
      console.error("Error loading stages:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      xp: 0,
      currentStage: 1,
      completedLessons: [],
      earnedBadges: [],
      loginDates: [],
      streakDays: 0
    };
    this.users.set(id, user);
    return user;
  }

  async getStages(): Promise<Stage[]> {
    return this.stages;
  }

  async getStageById(id: number): Promise<Stage | undefined> {
    return this.stages.find(stage => stage.id === id);
  }

  async getLessonById(stageId: number, lessonId: number): Promise<Lesson | undefined> {
    const stage = await this.getStageById(stageId);
    if (!stage) return undefined;
    
    return stage.lessons.find(lesson => lesson.id === lessonId);
  }
}

export class DatabaseStorage implements IStorage {
  private stages: Stage[];

  constructor() {
    this.stages = [];
    this.loadStages();
  }

  private loadStages() {
    try {
      // Load stages from JSON file
      const stagesPath = path.join(process.cwd(), 'data', 'stages.json');
      
      if (fs.existsSync(stagesPath)) {
        const stagesData = fs.readFileSync(stagesPath, 'utf8');
        this.stages = JSON.parse(stagesData);
      } else {
        console.warn("stages.json file not found, using empty stages array");
      }
    } catch (error) {
      console.error("Error loading stages:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        xp: 0,
        currentStage: 1,
        completedLessons: [],
        earnedBadges: [],
        loginDates: [],
        streakDays: 0
      })
      .returning();
    return user;
  }

  async getStages(): Promise<Stage[]> {
    return this.stages;
  }

  async getStageById(id: number): Promise<Stage | undefined> {
    return this.stages.find(stage => stage.id === id);
  }

  async getLessonById(stageId: number, lessonId: number): Promise<Lesson | undefined> {
    const stage = await this.getStageById(stageId);
    if (!stage) return undefined;
    
    return stage.lessons.find(lesson => lesson.id === lessonId);
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
