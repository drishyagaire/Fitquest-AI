import { useAchievements } from "@/hooks/use-achievements";
import { Loader2, Trophy, Medal, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const iconMap: Record<string, any> = {
  Trophy,
  Medal,
  Crown,
  Star
};

export default function Achievements() {
  const { data: achievements, isLoading } = useAchievements();

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-primary" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-display font-bold text-glow-primary">Hall of Fame</h1>
        <p className="text-muted-foreground text-lg">Unlock badges by reaching milestones.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {achievements?.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Star;
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <div 
              key={achievement.id}
              className={cn(
                "relative group flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-300",
                isUnlocked 
                  ? "bg-gradient-to-br from-card to-background border-primary/30 shadow-[0_0_30px_-15px_hsl(var(--primary)/0.3)] hover:scale-105" 
                  : "bg-muted/10 border-white/5 opacity-50 grayscale hover:opacity-60"
              )}
            >
              {isUnlocked && (
                <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-50" />
              )}
              
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10",
                isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-center z-10 font-display">{achievement.title}</h3>
              <p className="text-sm text-center text-muted-foreground mt-2 z-10">{achievement.description}</p>
              
              {isUnlocked && (
                <div className="mt-4 pt-4 border-t border-white/5 w-full text-center">
                  <p className="text-xs text-primary font-mono">
                    UNLOCKED: {format(new Date(achievement.unlockedAt!), "MMM d")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
