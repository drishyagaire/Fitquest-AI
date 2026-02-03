import { useFoods, useCreateFood, useEstimateNutrition } from "@/hooks/use-foods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Sparkles, Utensils } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

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
  const estimateNutrition = useEstimateNutrition();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");

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
        setDescription("");
      },
    });
  };

  const handleEstimate = () => {
    if (!description.trim()) {
      toast({
        title: "Add a description",
        description: "Try something like '150g chicken with rice'.",
        variant: "destructive",
      });
      return;
    }

    estimateNutrition.mutate(description, {
      onSuccess: (estimate) => {
        if (estimate.matchedItems.length === 0) {
          toast({
            title: "No matches found",
            description: estimate.notes ?? "Try adding quantities like '2 eggs' or '150g chicken'.",
            variant: "destructive",
          });
          return;
        }

        form.setValue("name", estimate.name, { shouldValidate: true });
        form.setValue("calories", estimate.calories, { shouldValidate: true });
        form.setValue("protein", estimate.protein, { shouldValidate: true });
        form.setValue("carbs", estimate.carbs, { shouldValidate: true });
        form.setValue("fats", estimate.fats, { shouldValidate: true });
      },
    });
  };

  if (isLoading)
    return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 text-primary" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-glow-primary mb-2">Food Log</h1>
          <p className="text-muted-foreground">Track your fuel.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_hsl(var(--primary))]"
            >
              <Plus className="w-5 h-5 mr-2" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>Log Meal</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              {/* AI Meal Description */}
              <div className="space-y-2">
                <Label>Describe your meal (AI estimate)</Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g. 150g chicken breast with 1 cup rice"
                  className="bg-background/50 min-h-[90px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tip: include quantities like grams or pieces.</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleEstimate}
                    disabled={estimateNutrition.isPending}
                    className="gap-2"
                  >
                    {estimateNutrition.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Estimate
                  </Button>
                </div>
              </div>

              {/* Food Name */}
              <div className="space-y-2">
                <Label>Food Name</Label>
                <Input
                  {...form.register("name")}
                  placeholder="e.g. Chicken Breast"
                  className="bg-background/50"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Nutrition Inputs */}
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
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
