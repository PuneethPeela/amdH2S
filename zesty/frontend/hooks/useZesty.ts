'use client';

import { useState, useCallback } from 'react';
import type { FoodLogResponse, HealthScore, RecipeResponse, DailySummary } from '@/types';
import { logFood, getHealthScore, getRecipes, getDailySummary } from '@/lib/api';

export function useFoodLog() {
    const [isLogging, setIsLogging] = useState(false);
    const [lastLog, setLastLog] = useState<FoodLogResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const log = useCallback(async (query: string): Promise<FoodLogResponse | null> => {
        setIsLogging(true);
        setError(null);
        try {
            const result = await logFood({ query });
            setLastLog(result);
            return result;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to log food';
            setError(msg);
            return null;
        } finally {
            setIsLogging(false);
        }
    }, []);

    return { log, isLogging, lastLog, error };
}

export function useHealthScore() {
    const [data, setData] = useState<HealthScore | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const result = await getHealthScore();
            setData(result);
        } catch {
            // Silently fail; UI shows stale data
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, refresh };
}

export function useRecipes() {
    const [data, setData] = useState<RecipeResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (preferences: string = 'Healthy balanced meal'): Promise<void> => {
        setLoading(true);
        try {
            const result = await getRecipes(preferences);
            setData(result);
        } catch {
            // Keep stale
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, fetch };
}

export function useDailySummary() {
    const [data, setData] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const result = await getDailySummary();
            setData(result);
        } catch {
            // Graceful fallback; component handles null
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, fetch };
}
