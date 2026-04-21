import type { FoodLogRequest, FoodLogResponse, HealthScore, RecipeResponse, DailySummary } from '@/types';
import {
    FoodLogResponseSchema,
    HealthScoreSchema,
    RecipeResponseSchema,
    DailySummarySchema,
} from '@/types';

// Ensure browser calls are strictly relative to the host domain so Next.js middleware handles routing
const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function apiFetch<T>(
    path: string,
    options?: RequestInit,
    schema?: { parse: (data: unknown) => T }
): Promise<T> {
    const defaultOptions: RequestInit = {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        ...options,
    };
    const res = await fetch(`${BASE}${path}`, defaultOptions);
    if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    const json: unknown = await res.json();
    return schema ? schema.parse(json) : (json as T);
}

export async function logFood(req: FoodLogRequest): Promise<FoodLogResponse> {
    return apiFetch<FoodLogResponse>(
        '/food_log/',
        { method: 'POST', body: JSON.stringify(req) },
        FoodLogResponseSchema
    );
}

export async function getHealthScore(): Promise<HealthScore> {
    return apiFetch<HealthScore>('/health_profile/', undefined, HealthScoreSchema);
}

export async function getRecipes(preferences: string): Promise<RecipeResponse> {
    return apiFetch<RecipeResponse>(
        '/recipe_engine/',
        { method: 'POST', body: JSON.stringify({ preferences }) },
        RecipeResponseSchema
    );
}

export async function getDailySummary(): Promise<DailySummary> {
    return apiFetch<DailySummary>('/food_log/summary', undefined, DailySummarySchema);
}

export async function getNearbyLocations(lat: number, lng: number): Promise<any> {
    return apiFetch<any>(`/location/nearby?lat=${lat}&lng=${lng}`, { method: 'GET' });
}
