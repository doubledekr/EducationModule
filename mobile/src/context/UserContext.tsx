import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, CompletedLesson } from '../types';

interface UserContextType {
  user: User;
  updateXP: (xpToAdd: number) => void;
  addCompletedLesson: (lesson: CompletedLesson) => void;
  updateLoginStreak: (date: string) => void;
  addBadge: (badgeId: string) => void;
}

const INITIAL_USER: User = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Johnson',
  username: 'alexj',
  email: 'alex@example.com',
  xp: 0,
  currentStage: 1,
  completedLessons: [],
  earnedBadges: [],
  loginDates: [new Date().toISOString().split('T')[0]],
  streakDays: 1,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(INITIAL_USER);

  const updateXP = (xpToAdd: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + xpToAdd
    }));
  };

  const addCompletedLesson = (lesson: CompletedLesson) => {
    setUser(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lesson],
      xp: prev.xp + lesson.xpEarned
    }));
  };

  const updateLoginStreak = (date: string) => {
    setUser(prev => {
      const loginDates = [...prev.loginDates, date];
      return {
        ...prev,
        loginDates,
        streakDays: calculateStreak(loginDates)
      };
    });
  };

  const addBadge = (badgeId: string) => {
    setUser(prev => ({
      ...prev,
      earnedBadges: [...prev.earnedBadges, badgeId]
    }));
  };

  const calculateStreak = (dates: string[]): number => {
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i - 1]);
      const previous = new Date(sortedDates[i]);
      const diffTime = current.getTime() - previous.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <UserContext.Provider value={{
      user,
      updateXP,
      addCompletedLesson,
      updateLoginStreak,
      addBadge
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}