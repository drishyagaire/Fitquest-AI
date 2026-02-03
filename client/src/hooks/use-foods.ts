import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertFood } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const USER_ID = 1;

export function useFoods() {
  return useQuery({
    queryKey: [api.foods.list.path, USER_ID],
    queryFn: async () => {
      const res = await fetch(`${api.foods.list.path}?userId=${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch foods");
      return api.foods.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertFood, "userId">) => {
      const payload = { ...data, userId: USER_ID };
      const validated = api.foods.create.input.parse(payload);
      
      const res = await fetch(api.foods.create.path, {
        method: api.foods.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to log food");
      return api.foods.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.foods.list.path, USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1"] }); 
      toast({ title: "Meal Logged!", description: "Nutrition tracked." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
export function useEstimateNutrition() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (description: string) => {
      const payload = api.foods.estimate.input.parse({ description });
      const res = await fetch(api.foods.estimate.path, {
        method: api.foods.estimate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to estimate nutrition");
      return api.foods.estimate.responses[200].parse(await res.json());
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}