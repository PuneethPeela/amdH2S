'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { FoodLogResponse } from '@/types';
import { FoodLogRequestSchema } from '@/types';
import { cn } from '@/lib/utils';

interface FoodLoggerProps {
    onLog: (query: string) => Promise<FoodLogResponse | null>;
    isLogging: boolean;
    lastLog: FoodLogResponse | null;
}

const SUGGESTIONS = [
    'Dal rice (medium bowl)',
    'Chicken salad (large)',
    'Banana',
    'Idli sambar (2 pieces)',
    'Greek yoghurt',
    'Avocado toast',
];

export function FoodLogger({ onLog, isLogging, lastLog }: FoodLoggerProps): React.JSX.Element {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        const validation = FoodLogRequestSchema.safeParse({ query });
        if (!validation.success) {
            setError(validation.error.issues[0]?.message ?? 'Invalid input');
            return;
        }

        const result = await onLog(query.trim());
        if (result) {
            setQuery('');
            toast.success(`Logged: ${result.item_name} (${result.calories} kcal)`, { icon: '🍽️' });
            if (result.allergy_alert) {
                toast.error(`⚠️ ${result.allergy_alert}`, { duration: 8000 });
            }
        } else {
            toast.error('Failed to log food. Please try again.');
        }
    };

    const handleSuggestion = (s: string): void => {
        setQuery(s);
        inputRef.current?.focus();
    };

    return (
        <section aria-labelledby="food-logger-heading" className="glass p-6 space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5c.67 0 1.35.09 2 .26M9 22H7a2 2 0 01-2-2v-7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-2" />
                        <path d="M12 5C8.69 5 6 7.69 6 11v1h12v-1c0-3.31-2.69-6-6-6z" />
                    </svg>
                </div>
                <h2 id="food-logger-heading" className="text-lg font-bold text-white">
                    What did you eat?
                </h2>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="relative">
                    <label htmlFor="food-query" className="sr-only">
                        Describe what you ate, e.g. 2 slices whole wheat toast with avocado
                    </label>
                    <input
                        ref={inputRef}
                        id="food-query"
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setError(''); }}
                        placeholder="e.g. Dal rice medium bowl, 2 rotis with sabzi..."
                        className={cn(
                            'zesty-input pr-32',
                            error && 'border-red-500/60 focus:ring-red-500/40',
                        )}
                        aria-describedby={error ? 'food-query-error' : 'food-query-hint'}
                        aria-invalid={!!error}
                        disabled={isLogging}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLogging || !query.trim()}
                        className="btn-primary absolute right-2 top-2 bottom-2 !py-1 !px-4 !min-h-0 !text-sm"
                        aria-label={isLogging ? 'Analyzing food...' : 'Log this food'}
                    >
                        {isLogging ? (
                            <span className="flex items-center gap-1.5">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Analyzing
                            </span>
                        ) : 'Log Food'}
                    </button>
                </div>

                {error && (
                    <p id="food-query-error" role="alert" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <span aria-hidden="true">⚠</span> {error}
                    </p>
                )}
                <p id="food-query-hint" className="sr-only">
                    Type a food description and press enter or click Log Food to record your meal.
                </p>
            </form>

            {/* Quick suggestions */}
            <div role="group" aria-label="Quick food suggestions" className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => handleSuggestion(s)}
                        className="tag bg-white/5 text-slate-300 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-300 transition-all duration-200 cursor-pointer py-1.5 px-3 min-h-[36px]"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Log result with aria-live for screen reader announcement */}
            {lastLog && (
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    role="status"
                    className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4 space-y-3 animate-fade-in-up"
                >
                    <p className="text-sm font-semibold text-emerald-300">{lastLog.message}</p>
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Nutritional breakdown">
                        {([
                            { label: 'Calories', value: lastLog.calories, unit: 'kcal', color: 'text-orange-400' },
                            { label: 'Protein', value: lastLog.protein, unit: 'g', color: 'text-blue-400' },
                            { label: 'Carbs', value: lastLog.carbs, unit: 'g', color: 'text-yellow-400' },
                            { label: 'Fat', value: lastLog.fat, unit: 'g', color: 'text-red-400' },
                            { label: 'Fibre', value: lastLog.fibre, unit: 'g', color: 'text-emerald-400' },
                        ] as const).map(({ label, value, unit, color }) => (
                            <div
                                key={label}
                                role="listitem"
                                className="glass-light px-3 py-1.5 flex flex-col items-center min-w-[60px]"
                            >
                                <span className={`text-base font-bold tabular-nums ${color}`}>
                                    {Math.round(value)}
                                    <span className="text-[10px] font-normal ml-0.5">{unit}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
