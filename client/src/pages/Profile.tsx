import { useUser, useUpdateUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      caloriesGoal: 2000,
      workoutsGoal: 5
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        caloriesGoal: user.caloriesGoal,
        workoutsGoal: user.workoutsGoal
      });
    }
  }, [user, reset]);

  const onSubmit = (data: any) => {
    updateUser.mutate({
      caloriesGoal: Number(data.caloriesGoal),
      workoutsGoal: Number(data.workoutsGoal)
    });
  };

  if (isLoading || !user) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-primary" />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-2xl border-x border-t border-white/5" />
        <div className="absolute -bottom-12 left-8 flex items-end gap-4">
          <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="bg-muted text-2xl font-bold">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-16 px-8">
        <h1 className="text-3xl font-display font-bold">{user.username}</h1>
        <p className="text-muted-foreground">Level {user.level} Athlete</p>
      </div>

      <div className="px-4">
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" /> Settings & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Daily Calorie Goal</Label>
                  <Input 
                    type="number" 
                    {...register("caloriesGoal")} 
                    className="bg-background/50" 
                  />
                  <p className="text-xs text-muted-foreground">Target daily energy intake</p>
                </div>

                <div className="space-y-2">
                  <Label>Weekly Workout Goal</Label>
                  <Input 
                    type="number" 
                    {...register("workoutsGoal")} 
                    className="bg-background/50" 
                  />
                  <p className="text-xs text-muted-foreground">Target sessions per week</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Button type="submit" disabled={updateUser.isPending} className="ml-auto flex items-center gap-2">
                  {updateUser.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
