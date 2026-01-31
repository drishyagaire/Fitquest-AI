import { useActivities, useCreateActivity } from "@/hooks/use-activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Dumbbell, Timer, Flame } from "lucide-react";
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
import { format } from "date-fns";

const activitySchema = z.object({
  type: z.string().min(1, "Type is required"),
  duration: z.coerce.number().min(1, "Duration must be positive"),
  caloriesBurned: z.coerce.number().min(1, "Calories must be positive"),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

export default function ActivityTracker() {
  const { data: activities, isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const [open, setOpen] = useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: "Running",
      duration: 30,
      caloriesBurned: 300,
    },
  });

  const onSubmit = (data: ActivityFormValues) => {
    createActivity.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-accent" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-secondary mb-2">Workout Log</h1>
          <p className="text-muted-foreground">Track your XP gains.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold shadow-[0_0_20px_-5px_hsl(var(--accent))]">
              <Plus className="w-5 h-5 mr-2" /> Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>Log Workout</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select 
                  onValueChange={(val) => form.setValue("type", val)} 
                  defaultValue={form.getValues("type")}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Cycling">Cycling</SelectItem>
                    <SelectItem value="Weightlifting">Weightlifting</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="HIIT">HIIT</SelectItem>
                    <SelectItem value="Swimming">Swimming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" {...form.register("duration")} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Calories Burned</Label>
                  <Input type="number" {...form.register("caloriesBurned")} className="bg-background/50" />
                </div>
              </div>

              <Button type="submit" disabled={createActivity.isPending} className="w-full mt-4 bg-accent hover:bg-accent/90">
                {createActivity.isPending ? "Logging..." : "Complete Workout"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {activities?.map((activity) => (
          <Card key={activity.id} className="bg-card/50 border-white/5 hover:border-accent/30 transition-all duration-200 group">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg text-accent group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{activity.type}</h3>
                  <p className="text-sm text-muted-foreground">{format(new Date(activity.date), "PPP p")}</p>
                </div>
              </div>
              
              <div className="flex gap-8 text-right">
                <div>
                  <div className="flex items-center justify-end gap-1 text-muted-foreground text-sm uppercase font-mono">
                    <Timer className="w-3 h-3" /> Duration
                  </div>
                  <div className="text-xl font-bold">{activity.duration}m</div>
                </div>
                <div>
                  <div className="flex items-center justify-end gap-1 text-muted-foreground text-sm uppercase font-mono">
                    <Flame className="w-3 h-3 text-orange-500" /> Burn
                  </div>
                  <div className="text-xl font-bold text-orange-500">{activity.caloriesBurned}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {activities?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl">
            <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-muted-foreground">No workouts logged</h3>
            <p className="text-muted-foreground/60">Time to hit the gym!</p>
          </div>
        )}
      </div>
    </div>
  );
}
