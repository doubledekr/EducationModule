import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { User, CompletedLesson } from "@/lib/types";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User;
  updateXP: (xpToAdd: number) => void;
  addCompletedLesson: (lesson: CompletedLesson) => void;
  updateLoginStreak: (date: string) => void;
  addBadge: (badgeId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(userService.getUser());
  
  useEffect(() => {
    // Ensure we have the latest user data on mount
    setUser(userService.getUser());
  }, []);
  
  const updateXP = (xpToAdd: number) => {
    const updatedUser = userService.updateXP(xpToAdd);
    setUser(updatedUser);
  };
  
  const addCompletedLesson = (lesson: CompletedLesson) => {
    const updatedUser = userService.addCompletedLesson(lesson);
    setUser(updatedUser);
  };
  
  const updateLoginStreak = (date: string) => {
    const updatedUser = userService.updateLoginStreak(date);
    setUser(updatedUser);
  };
  
  const addBadge = (badgeId: string) => {
    const updatedUser = userService.addBadge(badgeId);
    setUser(updatedUser);
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateXP, 
        addCompletedLesson, 
        updateLoginStreak, 
        addBadge 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
