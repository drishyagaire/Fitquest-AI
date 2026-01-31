import { useUser } from "@/hooks/use-user";
import { useActivities } from "@/hooks/use-activities";
import { useFoods } from "@/hooks/use-foods";
import { StatCard } from "@/components/StatCard";
import { LevelBar } from "@/components/LevelBar";
import { 
  Flame, 
  Activity, 
  Utensils, 
  TrendingUp,
  Loader2 
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: activities, isLoading: isActivitiesLoading } = useActivities();
  const { data: foods, isLoading: isFoodsLoading } = useFoods();

  if (isUserLoading || isActivitiesLoading || isFoodsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Calculate daily totals
  const today = new Date().toDateString();
  
  const todaysCaloriesEaten = foods
    ?.filter(f => new Date(f.date).toDateString() === today)
    .reduce((sum, f) => sum + f.calories, 0) || 0;

  const todaysCaloriesBurned = activities
    ?.filter(a => new Date(a.date).toDateString() === today)
    .reduce((sum, a) => sum + a.caloriesBurned, 0) || 0;

  const weeklyWorkouts = activities?.length || 0; // Simplified for MVP

  // Chart data: last 7 days of calories burned
  const chartData = activities?.slice(0, 7).map(activity => ({
    name: format(new Date(activity.date), 'EEE'),
    calories: activity.caloriesBurned
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold mb-6">Welcome back, {user.username}</h2>
          <LevelBar 
            level={user.level} 
            currentXp={user.currentXp} 
            nextLevelXp={user.nextLevelXp} 
          />
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
          <Flame className="w-12 h-12 text-orange-500 mb-2 animate-pulse" />
          <div className="text-4xl font-display font-bold text-orange-500 text-glow-primary">
            {user.streak}
          </div>
          <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Day Streak</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calories In"
          value={todaysCaloriesEaten}
          icon={<Utensils className="w-4 h-4" />}
          description={`Goal: ${user.caloriesGoal}`}
          variant={todaysCaloriesEaten > user.caloriesGoal ? "secondary" : "primary"}
        />
        <StatCard
          title="Calories Out"
          value={todaysCaloriesBurned}
          icon={<Activity className="w-4 h-4" />}
          description="Burned today"
          variant="accent"
        />
        <StatCard
          title="Workouts"
          value={weeklyWorkouts}
          icon={<Dumbbell className="w-4 h-4" />}
          description={`Goal: ${user.workoutsGoal}/week`}
          variant="default"
        />
        <StatCard
          title="Net Calories"
          value={todaysCaloriesEaten - todaysCaloriesBurned}
          icon={<TrendingUp className="w-4 h-4" />}
          description="Net total"
          variant="default"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Activity Trend
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCalories)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-secondary" />
            Recent Meals
          </h3>
          <div className="space-y-4">
            {foods?.slice(0, 4).map((food) => (
              <div key={food.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <p className="font-medium">{food.name}</p>
                  <p className="text-xs text-muted-foreground">
                    P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                  </p>
                </div>
                <span className="font-mono text-secondary font-bold">
                  {food.calories} kcal
                </span>
              </div>
            ))}
            {foods?.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No meals logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
