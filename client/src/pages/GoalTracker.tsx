import { useGoals, useCreateGoal, useToggleGoal } from "@/hooks/use-goals";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Target, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
  description: z.string().min(1, "Description is required"),
  type: z.enum(["daily", "weekly"]),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function GoalTracker() {
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const toggleGoal = useToggleGoal();
  const [open, setOpen] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      description: "",
      type: "daily",
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    createGoal.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-primary" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Quests & Goals</h1>
          <p className="text-muted-foreground">Complete tasks to maintain your streak.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Plus className="w-5 h-5 mr-2" /> New Quest
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>New Quest</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Quest Description</Label>
                <Input {...form.register("description")} placeholder="e.g. Drink 2L water" className="bg-background/50" />
              </div>
              
              <div className="space-y-2">
                <Label>Frequency</Label>
                <select 
                  {...form.register("type")}
                  className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <Button type="submit" disabled={createGoal.isPending} className="w-full mt-4">
                Add Quest
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Quests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold uppercase text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4" /> Active Quests
          </h2>
          {goals?.filter(g => !g.completed).map((goal) => (
            <Card 
              key={goal.id} 
              className="bg-card/50 border-l-4 border-l-primary border-y-white/5 border-r-white/5 hover:bg-card/80 transition-colors cursor-pointer group"
              onClick={() => toggleGoal.mutate(goal.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  <Circle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">{goal.description}</p>
                  <span className="text-xs text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                    {goal.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {goals?.filter(g => !g.completed).length === 0 && (
            <p className="text-muted-foreground italic">No active quests. Add one to start!</p>
          )}
        </div>

        {/* Completed Quests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold uppercase text-muted-foreground flex items-center gap-2">
             Completed
          </h2>
          {goals?.filter(g => g.completed).map((goal) => (
            <Card 
              key={goal.id} 
              className="bg-muted/30 border-l-4 border-l-muted border-y-white/5 border-r-white/5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => toggleGoal.mutate(goal.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-lg line-through text-muted-foreground">{goal.description}</p>
                  <span className="text-xs text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                    {goal.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
