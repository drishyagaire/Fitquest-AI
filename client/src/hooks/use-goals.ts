import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertGoal } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const USER_ID = 1;

export function useGoals() {
  return useQuery({
    queryKey: [api.goals.list.path, USER_ID],
    queryFn: async () => {
      const res = await fetch(`${api.goals.list.path}?userId=${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch goals");
      return api.goals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertGoal, "userId" | "completed">) => {
      const payload = { ...data, userId: USER_ID, completed: false };
      const validated = api.goals.create.input.parse(payload);
      
      const res = await fetch(api.goals.create.path, {
        method: api.goals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to create goal");
      return api.goals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path, USER_ID] });
      toast({ title: "Goal Set!", description: "Go crush it." });
    },
  });
}

export function useToggleGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.goals.toggle.path, { id });
      const res = await fetch(url, {
        method: api.goals.toggle.method,
      });

      if (!res.ok) throw new Error("Failed to toggle goal");
      return api.goals.toggle.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path, USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1"] }); 
      if (data.completed) {
        toast({ title: "Goal Completed!", description: "Keep the streak alive! 🔥" });
      }
    },
  });
}
