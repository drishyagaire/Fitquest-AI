import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API Routes ---

  // Users
  app.get(api.users.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.patch(api.users.update.path, async (req, res) => {
    const id = Number(req.params.id);
    try {
      const input = api.users.update.input.parse(req.body);
      const updated = await storage.updateUser(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Activities
  app.get(api.activities.list.path, async (req, res) => {
    const userId = Number(req.query.userId || 1); // Default to user 1
    const list = await storage.getActivities(userId);
    res.json(list);
  });

  app.post(api.activities.create.path, async (req, res) => {
    try {
      const input = api.activities.create.input.parse(req.body);
      const activity = await storage.createActivity(input);
      
      // Basic Gamification: Add XP per activity (e.g., 10 XP per activity)
      const user = await storage.getUser(input.userId);
      if (user) {
        const xpGained = 50; // Flat 50 XP per workout
        let newXp = user.currentXp + xpGained;
        let newLevel = user.level;
        let nextLevelXp = user.nextLevelXp;

        // Level up logic
        if (newXp >= nextLevelXp) {
          newXp -= nextLevelXp;
          newLevel += 1;
          nextLevelXp = Math.floor(nextLevelXp * 1.2); // +20% harder each level
        }

        await storage.updateUser(user.id, {
          currentXp: newXp,
          level: newLevel,
          nextLevelXp: nextLevelXp
        });
      }

      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Foods
  app.get(api.foods.list.path, async (req, res) => {
    const userId = Number(req.query.userId || 1);
    const list = await storage.getFoods(userId);
    res.json(list);
  });

  app.post(api.foods.create.path, async (req, res) => {
    try {
      const input = api.foods.create.input.parse(req.body);
      const food = await storage.createFood(input);
      res.status(201).json(food);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Goals
  app.get(api.goals.list.path, async (req, res) => {
    const userId = Number(req.query.userId || 1);
    const list = await storage.getGoals(userId);
    res.json(list);
  });

  app.post(api.goals.create.path, async (req, res) => {
    try {
      const input = api.goals.create.input.parse(req.body);
      const goal = await storage.createGoal(input);
      res.status(201).json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.goals.toggle.path, async (req, res) => {
    const id = Number(req.params.id);
    const updated = await storage.toggleGoal(id);
    if (!updated) return res.status(404).json({ message: "Goal not found" });
    
    // XP reward for completing a goal
    if (updated.completed) {
      const user = await storage.getUser(updated.userId);
      if (user) {
         // Award 20 XP for goal completion
         const xpGained = 20;
         let newXp = user.currentXp + xpGained;
         let newLevel = user.level;
         let nextLevelXp = user.nextLevelXp;
 
         if (newXp >= nextLevelXp) {
           newXp -= nextLevelXp;
           newLevel += 1;
           nextLevelXp = Math.floor(nextLevelXp * 1.2);
         }
 
         await storage.updateUser(user.id, {
           currentXp: newXp,
           level: newLevel,
           nextLevelXp: nextLevelXp
         });
      }
    }

    res.json(updated);
  });

  // Achievements
  app.get(api.achievements.list.path, async (req, res) => {
    const userId = Number(req.query.userId || 1);
    const list = await storage.getAchievements(userId);
    res.json(list);
  });

  // Seed Data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUser = await storage.getUser(1);
  if (!existingUser) {
    // Create default user
    const user = await storage.createUser({
      username: "FitGamer",
      caloriesGoal: 2200,
      workoutsGoal: 4,
      level: 5,
      currentXp: 450,
      nextLevelXp: 1000,
      streak: 7,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=FitGamer"
    });

    // Seed Goals
    await storage.createGoal({ userId: user.id, description: "Drink 2L Water", type: "daily", completed: false });
    await storage.createGoal({ userId: user.id, description: "30 min Cardio", type: "daily", completed: true });
    await storage.createGoal({ userId: user.id, description: "No Sugar", type: "daily", completed: false });

    // Seed Achievements (Some locked, some unlocked)
    await storage.createAchievement({ userId: user.id, title: "Early Bird", description: "Complete a workout before 7 AM", icon: "Sun", unlockedAt: new Date() });
    await storage.createAchievement({ userId: user.id, title: "Marathoner", description: "Run 42km total", icon: "Trophy", unlockedAt: null });
    await storage.createAchievement({ userId: user.id, title: "Iron Pumper", description: "Lift 1000kg total", icon: "Dumbbell", unlockedAt: new Date() });
    
    // Seed Recent Activity
    await storage.createActivity({ userId: user.id, type: "Running", duration: 30, caloriesBurned: 300 });
    await storage.createActivity({ userId: user.id, type: "HIIT", duration: 45, caloriesBurned: 500 });
  }
}
