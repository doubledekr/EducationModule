import { Badge, Resource } from "./types";

export const XP_LEVELS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 449 },
  { level: 4, minXP: 450, maxXP: 699 },
  { level: 5, minXP: 700, maxXP: 999 },
  { level: 6, minXP: 1000, maxXP: 1349 },
  { level: 7, minXP: 1350, maxXP: 1749 },
];

export const BADGES: Badge[] = [
  {
    id: "first_quiz",
    name: "First Quiz",
    description: "Completed your first quiz",
    icon: "emoji_events",
    category: "achievement",
    backgroundColor: "#F7B500",
    requirements: {
      type: "lessons_completed",
      threshold: 1
    }
  },
  {
    id: "streak_3",
    name: "3 Day Streak",
    description: "Logged in for 3 consecutive days",
    icon: "military_tech",
    category: "progress",
    backgroundColor: "#4C49E8",
    requirements: {
      type: "streak",
      threshold: 3
    }
  },
  {
    id: "fast_learner",
    name: "Fast Learner",
    description: "Completed 5 lessons",
    icon: "psychology",
    category: "achievement",
    backgroundColor: "#35C1B1",
    requirements: {
      type: "lessons_completed",
      threshold: 5
    }
  },
  {
    id: "stage_1_master",
    name: "Stage 1 Master",
    description: "Completed Stage 1 with 100% accuracy",
    icon: "workspace_premium",
    category: "achievement",
    backgroundColor: "#EF4444",
    requirements: {
      type: "quiz_score",
      threshold: 100,
      specificStage: 1
    }
  },
  {
    id: "xp_champion",
    name: "XP Champion",
    description: "Earned over 500 XP",
    icon: "stars",
    category: "progress",
    backgroundColor: "#9333EA",
    requirements: {
      type: "xp_earned",
      threshold: 500
    }
  }
];

export const RESOURCES: Resource[] = [
  {
    id: "budgeting_guide",
    title: "Budgeting Guide",
    description: "Practical tips for creating your budget",
    icon: "menu_book",
    iconBackground: "#4C49E8",
    link: "/resources/budgeting"
  },
  {
    id: "savings_calculator",
    title: "Savings Calculator",
    description: "Calculate how your savings grow over time",
    icon: "calculate",
    iconBackground: "#35C1B1",
    link: "/resources/calculator"
  }
];

export const INITIAL_USER = {
  id: "user_1",
  firstName: "Jamie",
  lastName: "Smith",
  username: "jamiesmith",
  email: "jamie@example.com",
  xp: 240,
  currentStage: 1,
  completedLessons: [
    {
      stageId: 1,
      lessonId: 1,
      completedAt: "2023-07-01T12:00:00Z",
      score: 100,
      xpEarned: 20
    },
    {
      stageId: 1,
      lessonId: 2,
      completedAt: "2023-07-02T12:00:00Z",
      score: 90,
      xpEarned: 25
    },
    {
      stageId: 1,
      lessonId: 3,
      completedAt: "2023-07-03T12:00:00Z",
      score: 100,
      xpEarned: 30
    }
  ],
  earnedBadges: ["first_quiz", "streak_3", "fast_learner"],
  loginDates: [],
  streakDays: 0
};

export const LOCAL_STORAGE_KEYS = {
  USER: "dekr_finance_user",
  STAGES: "dekr_finance_stages"
};
