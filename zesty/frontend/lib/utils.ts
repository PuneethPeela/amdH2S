import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function formatCalories(n: number): string {
    return Math.round(n / 5) * 5 + ' kcal';
}

export function macroPercent(value: number, goal: number): number {
    if (goal === 0) return 0;
    return Math.min(Math.round((value / goal) * 100), 100);
}

export function greetUser(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export function scoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
}

export function scoreRingColor(score: number): string {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
}
