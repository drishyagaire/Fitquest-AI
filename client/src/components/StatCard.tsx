import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  description?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  description,
  variant = "default" 
}: StatCardProps) {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/50 shadow-[0_0_20px_-10px_hsl(var(--primary)/0.3)]",
    secondary: "border-secondary/50 shadow-[0_0_20px_-10px_hsl(var(--secondary)/0.3)]",
    accent: "border-accent/50 shadow-[0_0_20px_-10px_hsl(var(--accent)/0.3)]",
  };

  const textStyles = {
    default: "text-foreground",
    primary: "text-primary text-glow-primary",
    secondary: "text-secondary text-glow-secondary",
    accent: "text-accent",
  };

  return (
    <Card className={cn(
      "bg-card/50 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px]",
      variantStyles[variant]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase text-muted-foreground font-mono">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg bg-background/50", textStyles[variant])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold font-display", textStyles[variant])}>
          {value}
        </div>
        {(trend || description) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && <span className="text-primary mr-1">{trend}</span>}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
