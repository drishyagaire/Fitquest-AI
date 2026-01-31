import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertActivity } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const USER_ID = 1;

export function useActivities() {
  return useQuery({
    queryKey: [api.activities.list.path, USER_ID],
    queryFn: async () => {
      const res = await fetch(`${api.activities.list.path}?userId=${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.activities.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertActivity, "userId">) => {
      const payload = { ...data, userId: USER_ID };
      const validated = api.activities.create.input.parse(payload);
      
      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
           const err = await res.json();
           throw new Error(err.message);
        }
        throw new Error("Failed to create activity");
      }
      return api.activities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path, USER_ID] });
      // Invalidate user stats too as XP/level might change
      queryClient.invalidateQueries({ queryKey: ["/api/users/1"] }); 
      toast({ title: "Workout Logged!", description: "+XP Earned" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
