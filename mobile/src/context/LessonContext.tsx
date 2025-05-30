import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stage, Lesson } from '../types';

interface LessonContextType {
  stages: Stage[];
  loading: boolean;
  getStageById: (stageId: number) => Stage | undefined;
  getLessonById: (stageId: number, lessonId: number) => Lesson | undefined;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStages();
  }, []);

  async function loadStages() {
    try {
      // In a real app, this would fetch from your backend API
      // For now, using the same data structure as the web version
      const response = await fetch('http://localhost:5000/api/stages');
      if (response.ok) {
        const data = await response.json();
        setStages(data);
      }
    } catch (error) {
      console.error('Failed to load stages:', error);
      // Fallback to sample data for development
      setStages(getSampleStages());
    } finally {
      setLoading(false);
    }
  }

  const getStageById = (stageId: number): Stage | undefined => {
    return stages.find(stage => stage.id === stageId);
  };

  const getLessonById = (stageId: number, lessonId: number): Lesson | undefined => {
    const stage = getStageById(stageId);
    return stage?.lessons.find(lesson => lesson.id === lessonId);
  };

  return (
    <LessonContext.Provider value={{
      stages,
      loading,
      getStageById,
      getLessonById
    }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonProvider');
  }
  return context;
}

// Sample data structure for development
function getSampleStages(): Stage[] {
  return [
    {
      id: 1,
      title: "Core Money Skills",
      description: "Master the fundamentals of money management",
      requiredXP: 0,
      lessons: [
        {
          id: 1,
          title: "What is Money?",
          description: "Understanding the basic concept of money",
          duration: 10,
          xpReward: 50,
          content: [
            {
              type: 'text',
              title: 'Introduction to Money',
              content: 'Money is a medium of exchange that allows us to trade goods and services efficiently.'
            },
            {
              type: 'multiple-choice',
              question: {
                questionText: 'What is the primary function of money?',
                options: ['Storage', 'Medium of exchange', 'Decoration', 'Investment'],
                correctAnswer: 'Medium of exchange',
                explanation: 'Money primarily serves as a medium of exchange, making trade easier.'
              }
            }
          ]
        },
        {
          id: 2,
          title: "Budgeting Basics",
          description: "Learn how to create and manage a budget",
          duration: 15,
          xpReward: 75,
          content: [
            {
              type: 'text',
              title: 'Why Budget?',
              content: 'Budgeting helps you track income and expenses to achieve financial goals.'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Investing Basics",
      description: "Introduction to investment principles",
      requiredXP: 200,
      lessons: [
        {
          id: 1,
          title: "What is Investing?",
          description: "Understanding investment fundamentals",
          duration: 12,
          xpReward: 60,
          content: [
            {
              type: 'text',
              title: 'Investment Basics',
              content: 'Investing involves putting money into assets with the expectation of generating returns.'
            }
          ]
        }
      ]
    }
  ];
}