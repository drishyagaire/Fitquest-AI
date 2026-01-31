import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  Target, 
  Trophy, 
  User, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Food Tracker", href: "/food", icon: Utensils },
  { label: "Workouts", href: "/activities", icon: Dumbbell },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-sm border-r border-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <Dumbbell className="text-primary-foreground w-5 h-5" />
        </div>
        <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          FitQuest
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-primary-foreground font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active Background Gradient */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-100 z-0" />
                )}
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-0" />

                <item.icon className={cn("w-5 h-5 z-10 relative", isActive ? "animate-pulse" : "")} />
                <span className="z-10 relative">{item.label}</span>
                
                {isActive && (
                  <div className="absolute right-0 w-1 h-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-mono">v1.0.0 ALPHA</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background border-primary/20"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 animate-in slide-in-from-left duration-300">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
