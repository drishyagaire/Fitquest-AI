import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface LevelBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
}

export function LevelBar({ currentXp, nextLevelXp, level }: LevelBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentXp / nextLevelXp) * 100));

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-accent/20 rounded text-accent">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-accent">Level {level}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {currentXp} / <span className="text-foreground">{nextLevelXp} XP</span>
        </span>
      </div>
      
      <div className="h-4 bg-muted rounded-full overflow-hidden relative border border-white/5">
        <motion.div
          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-accent to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0ibm9uZSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-30" />
        </motion.div>
      </div>
      
      <p className="text-xs text-right text-muted-foreground">
        {nextLevelXp - currentXp} XP to next level
      </p>
    </div>
  );
}
