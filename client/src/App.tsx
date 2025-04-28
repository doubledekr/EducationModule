import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Lesson from "@/pages/Lesson";
import BadgePage from "@/pages/Badge";
import ProgressPage from "@/pages/Progress";
import Profile from "@/pages/Profile";
import { UserProvider } from "@/context/UserContext";
import { LessonProvider } from "@/context/LessonContext";
import { useEffect } from "react";
import { getToday } from "./lib/utils";
import { userService } from "./services/userService";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lesson/:stageId/:lessonId" component={Lesson} />
      <Route path="/badges" component={BadgePage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Update login streak
    userService.updateLoginStreak(getToday());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <LessonProvider>
            <Toaster />
            <Router />
          </LessonProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
