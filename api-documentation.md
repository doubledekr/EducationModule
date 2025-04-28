# Financial Literacy Learning System API Documentation

## Current API Endpoints

| Endpoint | Method | Description | Request Parameters | Response Format | Graphics Requirements |
|----------|--------|-------------|-------------------|-----------------|----------------------|
| `/api/stages` | GET | Retrieves all learning stages | None | JSON array of Stage objects | Stage completion graphics, Stage icons |
| `/api/stages/:stageId` | GET | Retrieves a specific stage by ID | `stageId` (path parameter) | JSON Stage object | Stage-specific illustrations |
| `/api/stages/:stageId/lessons/:lessonId` | GET | Retrieves a specific lesson within a stage | `stageId` and `lessonId` (path parameters) | JSON Lesson object | Lesson graphics, Topic illustrations |

## Recommended Additional Endpoints

| Endpoint | Method | Description | Request Parameters | Response Format | Graphics Requirements |
|----------|--------|-------------|-------------------|-----------------|----------------------|
| `/api/auth/register` | POST | Register a new user | JSON body with `username`, `password`, `firstName`, `lastName`, `email` | JSON User object (excluding password) | User avatar illustrations |
| `/api/auth/login` | POST | Authenticate a user | JSON body with `username`, `password` | JWT token and User object | Authentication success graphics |
| `/api/auth/logout` | POST | Log out current user | None | Success message | Logout confirmation graphics |
| `/api/users/:userId` | GET | Get user profile data | `userId` (path parameter) | JSON User object | User profile banner graphics |
| `/api/users/:userId` | PATCH | Update user profile | JSON body with fields to update | Updated JSON User object | Profile update confirmation graphics |
| `/api/users/:userId/progress` | GET | Get user learning progress | `userId` (path parameter) | JSON Progress object | Progress chart graphics, XP visualization |
| `/api/users/:userId/lessons/:lessonId/complete` | POST | Mark a lesson as completed | `userId`, `lessonId` (path parameters), JSON body with `score`, `xpEarned` | Updated User progress | Lesson completion celebration graphics |
| `/api/users/:userId/badges` | GET | Get user's earned badges | `userId` (path parameter) | JSON array of Badge objects | Badge icons for each badge type |
| `/api/badges` | GET | Get all available badges | None | JSON array of Badge objects | Locked and unlocked badge states |
| `/api/leaderboard` | GET | Get global leaderboard | Optional: `limit`, `offset` query parameters | JSON array of User ranking objects | Trophy icons, rank indicators |
| `/api/media/audio/:stageId/:lessonId` | GET | Get audio for a specific lesson | `stageId` and `lessonId` (path parameters) | Audio file (MP3) | Audio player UI elements |
| `/api/media/video/:stageId/:lessonId` | GET | Get video for a specific lesson | `stageId` and `lessonId` (path parameters) | Video file | Video player UI elements, thumbnails |

## Data Models

### User Model
```typescript
{
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  xp: number,
  currentStage: number,
  completedLessons: [
    {
      stageId: number,
      lessonId: number,
      completedAt: string, // ISO date format
      score: number,
      xpEarned: number
    }
  ],
  earnedBadges: string[], // Array of badge IDs
  loginDates: string[], // Array of ISO date strings
  streakDays: number
}
```

### Stage Model
```typescript
{
  id: number,
  title: string,
  description: string,
  lessons: Lesson[],
  requiredXP: number,
  checkpointQuiz?: Quiz
}
```

### Lesson Model
```typescript
{
  id: number,
  title: string,
  description: string,
  duration: number, // in minutes
  xpReward: number,
  content: LessonContent[],
  quiz?: Quiz,
  isLocked: boolean
}
```

### Badge Model
```typescript
{
  id: string,
  name: string,
  description: string,
  icon: string, // Icon identifier for UI
  category: 'achievement' | 'progress' | 'special',
  backgroundColor: string, // Color code
  unlockedAt?: string, // ISO date format
  requirements: {
    type: 'lessons_completed' | 'streak' | 'xp_earned' | 'quiz_score',
    threshold: number,
    specificStage?: number
  }
}
```

## Lesson Content Types

### Text Block
```typescript
{
  type: 'text',
  title?: string,
  content: string
}
```

### Image Block
```typescript
{
  type: 'image',
  imageUrl: string,
  caption?: string
}
```

### Video Block
```typescript
{
  type: 'video',
  videoUrl: string,
  title?: string,
  description?: string,
  thumbnailUrl?: string,
  duration?: number
}
```

### Audio Block
```typescript
{
  type: 'audio',
  audioUrl: string,
  audioTitle?: string,
  transcript?: string,
  audioDuration?: number
}
```

### Tap-to-Reveal Card
```typescript
{
  type: 'tap-to-reveal',
  title: string,
  hiddenContent: string | string[]
}
```

### Multiple Choice Question
```typescript
{
  type: 'multiple-choice',
  question: {
    questionText: string,
    options: string[],
    correctAnswer: string | string[] | number[],
    explanation?: string
  },
  multiSelect?: boolean
}
```

### True/False Question
```typescript
{
  type: 'true-false',
  question: {
    questionText: string,
    options: string[],
    correctAnswer: string | string[] | number[],
    explanation?: string
  }
}
```

### Sorting Activity
```typescript
{
  type: 'sorting',
  title: string,
  categories: {
    name: string,
    items: string[]
  }[],
  unsortedItems: {
    item: string,
    correctCategory: string
  }[]
}
```

## Integration Notes for Developers

1. **Authentication**: All endpoints except `/api/auth/login` and `/api/auth/register` require JWT authentication using Bearer token.
2. **Error Handling**: All endpoints follow a consistent error format:
   ```json
   {
     "message": "Error description",
     "statusCode": 400
   }
   ```
3. **Media Handling**: Audio and video files follow a consistent naming pattern:
   - Audio: `lesson_[stageId]_[lessonId].mp3`
   - Video: `lesson_[stageId]_[lessonId].mp4`
4. **Pagination**: Endpoints returning multiple items support `limit` and `offset` query parameters for pagination.

## Design Guidelines for UI Integration

1. **Badge Icons**: Create icons for each badge type that can appear in both locked (grayscale) and unlocked (colored) states.
2. **Progress Visualization**: Design graphics that represent user XP and progress, suitable for different levels.
3. **Lesson Completion**: Create celebration animations/graphics for when users complete lessons.
4. **Audio/Video Players**: Design custom player UIs that match the application's aesthetic.
5. **Stage Maps**: Create visual maps that show progression through stages with clear indicators of completed, current, and locked content.

## XP System

The application uses an experience points (XP) system to track user progress:

- Users gain XP by completing lessons (base XP value defined per lesson)
- Users gain additional XP by scoring well on quizzes
- Streak days contribute bonus XP
- XP thresholds define level progression
- Each stage has a required XP level to unlock

## Badge System

The badge system provides achievements for various accomplishments:

| Badge Type | Trigger | Graphics Needed |
|------------|---------|-----------------|
| Lesson Completion | Complete X number of lessons | Learning/Book icon |
| Streak Achievement | Maintain streak for X days | Fire/Flame icon |
| XP Milestone | Reach X amount of XP | Star/Trophy icon |
| Quiz Master | Score 100% on X quizzes | Brain/Certificate icon |
| Stage Completion | Complete all lessons in a stage | Medal/Award icon |

Each badge should have both locked and unlocked visual states, with the unlocked state using the badge's specified color code.