import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

const USER_ID = 1;

export function useAchievements() {
  return useQuery({
    queryKey: [api.achievements.list.path, USER_ID],
    queryFn: async () => {
      const res = await fetch(`${api.achievements.list.path}?userId=${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return api.achievements.list.responses[200].parse(await res.json());
    },
  });
}
