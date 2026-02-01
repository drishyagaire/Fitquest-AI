import { db } from "./db";
import {
  users, activities, foods, goals, achievements,
  type User, type InsertUser,
  type Activity, type InsertActivity,
  type Food, type InsertFood,
  type Goal, type InsertGoal,
  type Achievement
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  findUserByUsername(username: string): Promise<User | undefined>; // ✅ added

  // Activities
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  deleteActivity(id: number): Promise<boolean>; // ✅ added

  // Foods
  getFoods(userId: number): Promise<Food[]>;
  createFood(food: InsertFood): Promise<Food>;
  deleteFood(id: number): Promise<boolean>; // ✅ added

  // Goals
  getGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  toggleGoal(id: number): Promise<Goal | undefined>;

  // Achievements
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: Omit<Achievement, "id">): Promise<Achievement>;
}

export class DatabaseStorage implements IStorage {
  // --- User Methods ---
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  async findUserByUsername(username: string): Promise<User | undefined> { // ✅ added
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // --- Activity Methods ---
  async getActivities(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.date));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async deleteActivity(id: number): Promise<boolean> { // ✅ added
    const result = await db.delete(activities).where(eq(activities.id, id)).returning();
    return result.length > 0;
  }

  // --- Food Methods ---
  async getFoods(userId: number): Promise<Food[]> {
    return await db.select().from(foods).where(eq(foods.userId, userId)).orderBy(desc(foods.date));
  }

  async createFood(food: InsertFood): Promise<Food> {
    const [newFood] = await db.insert(foods).values(food).returning();
    return newFood;
  }

  async deleteFood(id: number): Promise<boolean> { // ✅ added
    const result = await db.delete(foods).where(eq(foods.id, id)).returning();
    return result.length > 0;
  }

  // --- Goal Methods ---
  async getGoals(userId: number): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values(goal).returning();
    return newGoal;
  }

  async toggleGoal(id: number): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    if (!goal) return undefined;

    const [updated] = await db.update(goals)
      .set({ completed: !goal.completed })
      .where(eq(goals.id, id))
      .returning();
    return updated;
  }

  // --- Achievement Methods ---
  async getAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(achievement: Omit<Achievement, "id">): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }
}

export const storage = new DatabaseStorage();
