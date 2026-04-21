'use client';

import React, { useState } from 'react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';

const TAG_COLORS: Record<string, string> = {
    'high-protein': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'vegan': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'vegetarian': 'bg-green-500/20 text-green-300 border-green-500/30',
    'quick': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'high-fibre': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'keto-friendly': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'no-cook': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'probiotic': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'heart-healthy': 'bg-red-500/20 text-red-300 border-red-500/30',
    'comfort': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};

interface RecipeCardProps {
    recipe: Recipe;
    index: number;
}

export function RecipeCard({ recipe, index }: RecipeCardProps): React.JSX.Element {
    const [expanded, setExpanded] = useState(false);
    const accordionId = `recipe-steps-${index}`;
    const headingId = `recipe-heading-${index}`;

    return (
        <article
            aria-labelledby={headingId}
            className="glass-hover p-5 space-y-4"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <h3 id={headingId} className="font-bold text-white leading-snug">{recipe.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span aria-label={`${recipe.calories} calories`}>🔥 {recipe.calories} kcal</span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span aria-label={`${recipe.prep_time} minutes preparation time`}>⏱ {recipe.prep_time} min</span>
                    </div>
                </div>
            </div>

            {/* Tags — not relying on color alone */}
            {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5" role="list" aria-label="Recipe tags">
                    {recipe.tags.map((tag) => (
                        <span
                            key={tag}
                            role="listitem"
                            className={cn('tag border text-[11px]', TAG_COLORS[tag] ?? 'bg-slate-800 text-slate-400 border-slate-700')}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Nutritional note */}
            {recipe.nutritional_note && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2 leading-relaxed">
                    <span aria-hidden="true">✦ </span>{recipe.nutritional_note}
                </p>
            )}

            {/* Expandable steps */}
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-controls={accordionId}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-orange-400 transition-colors py-1 min-h-[44px]"
            >
                <span className="font-medium">{expanded ? 'Hide' : 'View'} Instructions & Ingredients</span>
                <span aria-hidden="true" className={cn('transition-transform duration-200', expanded && 'rotate-180')}>
                    ▾
                </span>
            </button>

            <div id={accordionId} hidden={!expanded} className="space-y-3">
                {/* Ingredients */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ingredients</h4>
                    <ul className="space-y-1" aria-label={`Ingredients for ${recipe.name}`}>
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-orange-500 mt-0.5 text-xs" aria-hidden="true">•</span>
                                {ing}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instructions</h4>
                    <ol className="space-y-2" aria-label={`Instructions for ${recipe.name}`}>
                        {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold" aria-hidden="true">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </article>
    );
}

export function RecipeCardSkeleton(): React.JSX.Element {
    return (
        <div className="glass p-5 space-y-3" aria-hidden="true">
            <div className="skeleton h-5 w-3/4 rounded-lg" />
            <div className="skeleton h-3 w-1/2 rounded-lg" />
            <div className="flex gap-2">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
            </div>
        </div>
    );
}
