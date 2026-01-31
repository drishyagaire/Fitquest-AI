import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import FoodTracker from "@/pages/FoodTracker";
import ActivityTracker from "@/pages/ActivityTracker";
import GoalTracker from "@/pages/GoalTracker";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-background to-background">
        <div className="max-w-6xl mx-auto pt-12 lg:pt-0">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/food" component={FoodTracker} />
            <Route path="/activities" component={ActivityTracker} />
            <Route path="/goals" component={GoalTracker} />
            <Route path="/achievements" component={Achievements} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
