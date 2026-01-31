import { useFoods, useCreateFood } from "@/hooks/use-foods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Utensils } from "lucide-react";
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

const foodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.coerce.number().min(1, "Calories must be positive"),
  protein: z.coerce.number().default(0),
  carbs: z.coerce.number().default(0),
  fats: z.coerce.number().default(0),
});

type FoodFormValues = z.infer<typeof foodFormSchema>;

export default function FoodTracker() {
  const { data: foods, isLoading } = useFoods();
  const createFood = useCreateFood();
  const [open, setOpen] = useState(false);

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodFormSchema),
    defaultValues: {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  });

  const onSubmit = (data: FoodFormValues) => {
    createFood.mutate(data, {
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
          <h1 className="text-3xl font-display font-bold text-glow-primary mb-2">Food Log</h1>
          <p className="text-muted-foreground">Track your fuel.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_hsl(var(--primary))]">
              <Plus className="w-5 h-5 mr-2" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>Log Meal</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Food Name</Label>
                <Input {...form.register("name")} placeholder="e.g. Chicken Breast" className="bg-background/50" />
                {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input type="number" {...form.register("calories")} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input type="number" {...form.register("protein")} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input type="number" {...form.register("carbs")} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Fats (g)</Label>
                  <Input type="number" {...form.register("fats")} className="bg-background/50" />
                </div>
              </div>

              <Button type="submit" disabled={createFood.isPending} className="w-full mt-4">
                {createFood.isPending ? "Logging..." : "Add to Log"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {foods?.map((food) => (
          <Card key={food.id} className="bg-card/50 border-white/5 hover:border-primary/30 transition-all duration-200">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{food.name}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground font-mono">
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fats}g</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-display text-primary">{food.calories}</div>
                <div className="text-xs text-muted-foreground uppercase">kcal</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {foods?.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl">
            <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-muted-foreground">No food logged today</h3>
            <p className="text-muted-foreground/60">Start tracking to see your stats!</p>
          </div>
        )}
      </div>
    </div>
  );
}
