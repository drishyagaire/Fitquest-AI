import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  level: integer("level").default(1).notNull(),
  currentXp: integer("current_xp").default(0).notNull(),
  nextLevelXp: integer("next_level_xp").default(100).notNull(),
  streak: integer("streak").default(0).notNull(),
  caloriesGoal: integer("calories_goal").default(2000).notNull(),
  workoutsGoal: integer("workouts_goal").default(5).notNull(), // weekly goal
  avatarUrl: text("avatar_url"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // e.g., "Running", "Gym", "Yoga"
  duration: integer("duration").notNull(), // in minutes
  caloriesBurned: integer("calories_burned").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").default(0),
  carbs: integer("carbs").default(0),
  fats: integer("fats").default(0),
  date: timestamp("date").defaultNow().notNull(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  description: text("description").notNull(),
  completed: boolean("completed").default(false).notNull(),
  type: text("type").default("daily").notNull(), // "daily" or "weekly"
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  unlockedAt: timestamp("unlocked_at"), // null if locked
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, date: true });
export const insertFoodSchema = createInsertSchema(foods).omit({ id: true, date: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Achievement = typeof achievements.$inferSelect;
