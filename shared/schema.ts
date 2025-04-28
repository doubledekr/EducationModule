import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  xp: integer("xp").notNull().default(0),
  currentStage: integer("current_stage").notNull().default(1),
  completedLessons: jsonb("completed_lessons").notNull().default([]),
  earnedBadges: jsonb("earned_badges").notNull().default([]),
  loginDates: jsonb("login_dates").notNull().default([]),
  streakDays: integer("streak_days").notNull().default(0),
});

// Stage table schema
export const stages = pgTable("stages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredXP: integer("required_xp").notNull().default(0),
  content: jsonb("content").notNull(),
});

// Lesson table schema
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  stageId: integer("stage_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  xpReward: integer("xp_reward").notNull(),
  content: jsonb("content").notNull(),
  quiz: jsonb("quiz"),
  isLocked: boolean("is_locked").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

export const insertStageSchema = createInsertSchema(stages).pick({
  title: true,
  description: true,
  requiredXP: true,
  content: true,
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  stageId: true,
  title: true,
  description: true,
  duration: true,
  xpReward: true,
  content: true,
  quiz: true,
  isLocked: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStage = z.infer<typeof insertStageSchema>;
export type Stage = typeof stages.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Lesson content types
export const LessonContentSchema = z.object({
  type: z.enum(["text", "tap-to-reveal", "multiple-choice", "true-false", "sorting", "image"]),
  title: z.string().optional(),
  content: z.string().optional(),
  hiddenContent: z.union([z.string(), z.array(z.string())]).optional(),
  question: z.object({
    questionText: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.union([z.string(), z.array(z.string()), z.array(z.number())]),
    explanation: z.string().optional(),
  }).optional(),
  multiSelect: z.boolean().optional(),
  categories: z.array(z.object({
    name: z.string(),
    items: z.array(z.string()),
  })).optional(),
  unsortedItems: z.array(z.object({
    item: z.string(),
    correctCategory: z.string(),
  })).optional(),
  imageUrl: z.string().optional(),
  caption: z.string().optional(),
});

export type LessonContent = z.infer<typeof LessonContentSchema>;
