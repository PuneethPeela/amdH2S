'use client';

import React from 'react';
import { cn, macroPercent } from '@/lib/utils';

interface MacroBarProps {
    label: string;
    value: number;
    goal: number;
    unit: string;
    color: string; // tailwind bg class e.g. 'bg-orange-400'
    id: string;
}

export function MacroBar({ label, value, goal, unit, color, id }: MacroBarProps): React.JSX.Element {
    const pct = macroPercent(value, goal);
    const displayValue = Math.round(value);
    const displayGoal = Math.round(goal);

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
                <label htmlFor={id} className="text-slate-300">{label}</label>
                {/* Color is not the sole differentiator — number shown too */}
                <span className="text-slate-400 tabular-nums">
                    {displayValue}<span className="text-slate-600">/{displayGoal}{unit}</span>
                </span>
            </div>

            {/* role=progressbar with full ARIA — WCAG 4.1.2 */}
            <div className="macro-bar" id={id}>
                <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${label}: ${displayValue} of ${displayGoal} ${unit} (${pct}%)`}
                    className={cn('macro-fill', color)}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="text-right text-[10px] text-slate-500 tabular-nums" aria-hidden="true">
                {pct}%
            </div>
        </div>
    );
}
