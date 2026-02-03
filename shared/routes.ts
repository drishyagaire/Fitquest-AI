import { z } from 'zod';
import { insertUserSchema, insertActivitySchema, insertFoodSchema, insertGoalSchema, users, activities, foods, goals, achievements } from './schema';

const nutritionEstimateSchema = z.object({
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  matchedItems: z.array(z.string()),
  notes: z.string().optional(),
});

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/users/:id',
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/activities', // Query param ?userId=...
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/activities',
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  foods: {
    list: {
      method: 'GET' as const,
      path: '/api/foods', // Query param ?userId=...
      responses: {
        200: z.array(z.custom<typeof foods.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/foods',
      input: insertFoodSchema,
      responses: {
        201: z.custom<typeof foods.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    estimate: {
      method: 'POST' as const,
      path: '/api/foods/estimate',
      input: z.object({
        description: z.string().min(1),
      }),
      responses: {
        200: nutritionEstimateSchema,
        400: errorSchemas.validation,
      },
    },
  },

  goals: {
    list: {
      method: 'GET' as const,
      path: '/api/goals', // Query param ?userId=...
      responses: {
        200: z.array(z.custom<typeof goals.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/goals',
      input: insertGoalSchema,
      responses: {
        201: z.custom<typeof goals.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    toggle: {
      method: 'PATCH' as const,
      path: '/api/goals/:id/toggle',
      responses: {
        200: z.custom<typeof goals.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  achievements: {
    list: {
      method: 'GET' as const,
      path: '/api/achievements', // Query param ?userId=...
      responses: {
        200: z.array(z.custom<typeof achievements.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
