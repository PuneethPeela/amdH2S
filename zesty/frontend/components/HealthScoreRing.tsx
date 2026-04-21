'use client';

import React from 'react';
import type { HealthScore } from '@/types';
import { scoreRingColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HealthScoreRingProps {
    score: number;
    trend: HealthScore['trend'];
    className?: string;
}

export function HealthScoreRing({ score, trend, className }: HealthScoreRingProps): React.JSX.Element {
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;
    const color = scoreRingColor(score);

    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendLabel = trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable';

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            {/* SVG ring — role=img so screen readers announce value */}
            <div
                role="img"
                aria-label={`Health score: ${score} out of 100. ${trendLabel}.`}
                className="relative w-32 h-32"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
                    {/* Track */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                    {/* Fill */}
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
                        className="drop-shadow-[0_0_8px_currentColor]"
                    />
                </svg>
                {/* Score number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white tabular-nums">{score}</span>
                    <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
            </div>

            {/* Trend badge */}
            <div
                aria-live="polite"
                className={cn(
                    'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
                    trend === 'up' && 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                    trend === 'down' && 'text-red-400 bg-red-500/10 border-red-500/30',
                    trend === 'stable' && 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                )}
            >
                <span aria-hidden="true">{trendIcon}</span>
                <span>{trendLabel}</span>
            </div>
        </div>
    );
}
