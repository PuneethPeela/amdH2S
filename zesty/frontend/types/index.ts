// ─── Zod Schemas ─────────────────────────────────────────────────────────────
import { z } from 'zod';

export const FoodLogRequestSchema = z.object({
    query: z.string().min(2, 'Please enter at least 2 characters').max(500),
});

export const FoodLogResponseSchema = z.object({
    calories: z.number().int().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
    fibre: z.number().nonnegative(),
    item_name: z.string(),
    message: z.string(),
    allergy_alert: z.string().optional(),
});

export const HealthScoreSchema = z.object({
    score: z.number().int().min(0).max(100),
    trend: z.enum(['up', 'down', 'stable']),
    insights: z.array(z.string()),
    breakdown: z.object({
        nutritional_balance: z.number(),
        habit_consistency: z.number(),
        hydration: z.number(),
        meal_timing: z.number(),
        goal_alignment: z.number(),
    }).optional(),
    daily_totals: z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        fibre: z.number(),
        goal_calories: z.number(),
        goal_protein: z.number(),
    }).optional(),
});

export const RecipeSchema = z.object({
    name: z.string(),
    calories: z.number().int().nonnegative(),
    prep_time: z.number().int().nonnegative(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    nutritional_note: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const RecipeResponseSchema = z.object({
    recipes: z.array(RecipeSchema),
});

export const MealLogEntrySchema = z.object({
    id: z.string(),
    item_name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fibre: z.number(),
    logged_at: z.string(),
});

export const DailySummarySchema = z.object({
    logs: z.array(MealLogEntrySchema),
    total_calories: z.number(),
    total_protein: z.number(),
    total_carbs: z.number(),
    total_fat: z.number(),
    goal_calories: z.number(),
    streak: z.number(),
});

// ─── Inferred TypeScript types ────────────────────────────────────────────────
export type FoodLogRequest = z.infer<typeof FoodLogRequestSchema>;
export type FoodLogResponse = z.infer<typeof FoodLogResponseSchema>;
export type HealthScore = z.infer<typeof HealthScoreSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
export type MealLogEntry = z.infer<typeof MealLogEntrySchema>;
export type DailySummary = z.infer<typeof DailySummarySchema>;

// ─── UI-only types ────────────────────────────────────────────────────────────
export type ActiveTab = 'dashboard' | 'log' | 'recipes' | 'insights' | 'profile';
export type MacroKey = 'calories' | 'protein' | 'carbs' | 'fat' | 'fibre';
