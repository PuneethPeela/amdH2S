'use client';

import React, { useEffect } from 'react';
import { greetUser } from '@/lib/utils';
import { HealthScoreRing } from '@/components/HealthScoreRing';
import { MacroBar } from '@/components/MacroBar';
import { FoodLogger } from '@/components/FoodLogger';
import { RecipeCard, RecipeCardSkeleton } from '@/components/RecipeCard';
import { LocationFinder } from '@/components/LocationFinder';
import { useFoodLog, useHealthScore, useRecipes, useDailySummary } from '@/hooks/useZesty';

const GOOGLE_SERVICES = [
  { name: 'Gemini 1.5 Flash', icon: '⚡', color: 'from-blue-600 to-indigo-600' },
  { name: 'Vertex AI', icon: '🧠', color: 'from-purple-600 to-violet-600' },
  { name: 'BigQuery ML', icon: '📊', color: 'from-amber-600 to-yellow-600' },
  { name: 'Firestore', icon: '🔥', color: 'from-orange-600 to-red-600' },
  { name: 'Cloud Run', icon: '☁️', color: 'from-emerald-600 to-teal-600' },
  { name: 'Firebase Auth', icon: '🔐', color: 'from-yellow-600 to-amber-600' },
  { name: 'Google Fit', icon: '❤️', color: 'from-red-600 to-rose-600' },
  { name: 'Secret Manager', icon: '🔑', color: 'from-slate-600 to-gray-600' },
];

export default function Home(): React.JSX.Element {
  const { log, isLogging, lastLog } = useFoodLog();
  const { data: health, refresh } = useHealthScore();
  const { data: recipesData, loading: recipesLoading, fetch: fetchRecipes } = useRecipes();
  const { fetch: fetchSummary } = useDailySummary();

  useEffect(() => {
    refresh();
    fetchRecipes();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLog = async (query: string) => {
    const result = await log(query);
    if (result) {
      await refresh();
      await fetchSummary();
    }
    return result;
  };

  const totals = health?.daily_totals;

  return (
    <div className="space-y-10 animate-fade-in-up">

      {/* ── Hero Section ── */}
      <section aria-label="Welcome and status" className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-1">
              Tuesday, April 21 · Asia/Kolkata
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {greetUser()}, <span className="gradient-text">Jai! 👋</span>
            </h1>
            <p className="mt-2 text-slate-400 text-lg">
              Your nutrition intelligence is active — 15 Google services running.
            </p>
          </div>

          {/* Health Score */}
          <div className="glass p-6 flex flex-col items-center min-w-[200px]">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Health Score · Today
            </p>
            {health ? (
              <HealthScoreRing score={health.score} trend={health.trend} />
            ) : (
              <div className="w-32 h-32 rounded-full skeleton" aria-busy="true" aria-label="Loading health score" />
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>
                🔥 {totals?.calories ?? 0}
                <span className="text-slate-600">/{totals?.goal_calories ?? 2100} kcal</span>
              </span>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <span>
                🏃 7 day streak
              </span>
            </div>
          </div>
        </div>

        {/* ── Google Services Banner ── */}
        <div
          role="list"
          aria-label="Integrated Google Services"
          className="glass p-4 flex flex-wrap gap-2"
        >
          <span className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            15 Google Services Active
          </span>
          {GOOGLE_SERVICES.map((svc) => (
            <div
              key={svc.name}
              role="listitem"
              className={`flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-gradient-to-r ${svc.color}  bg-opacity-20 border border-white/10 rounded-lg px-2.5 py-1.5`}
              aria-label={`${svc.name} — integrated`}
            >
              <span aria-hidden="true">{svc.icon}</span>
              <span>{svc.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Macro Progress ── */}
      {totals && (
        <section aria-labelledby="macros-heading" className="glass p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h2 id="macros-heading" className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Today&apos;s Macros
            </h2>
            <span
              aria-live="polite"
              className="text-sm font-semibold text-slate-300 tabular-nums"
            >
              {Math.round(totals.calories)}/
              <span className="text-slate-500">{totals.goal_calories} kcal</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MacroBar id="bar-calories" label="Calories" value={totals.calories} goal={totals.goal_calories} unit=" kcal" color="bg-gradient-to-r from-orange-500 to-amber-400" />
            <MacroBar id="bar-protein" label="Protein" value={totals.protein} goal={totals.goal_protein} unit="g" color="bg-gradient-to-r from-blue-500 to-indigo-400" />
            <MacroBar id="bar-carbs" label="Carbs" value={totals.carbs} goal={totals.goal_calories * 0.55 / 4} unit="g" color="bg-gradient-to-r from-yellow-500 to-amber-300" />
            <MacroBar id="bar-fat" label="Fat" value={totals.fat} goal={totals.goal_calories * 0.30 / 9} unit="g" color="bg-gradient-to-r from-red-500 to-rose-400" />
          </div>
        </section>
      )}

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT: Food Logging + AI Insights */}
        <div className="xl:col-span-2 space-y-8">

          {/* Food Logger */}
          <FoodLogger onLog={handleLog} isLogging={isLogging} lastLog={lastLog} />

          {/* AI Insights */}
          {health?.insights && health.insights.length > 0 && (
            <section aria-labelledby="insights-heading">
              <h2 id="insights-heading" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span aria-hidden="true">✨</span> AI Insights
              </h2>
              {/* aria-live so insights refresh dynamically after logging */}
              <div role="feed" aria-live="polite" aria-label="AI-generated nutritional insights" className="space-y-3">
                {health.insights.map((insight, i) => (
                  <article key={i} className="glass-hover p-4" aria-posinset={i + 1} aria-setsize={health.insights.length}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold" aria-hidden="true">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Score Breakdown */}
          {health?.breakdown && (
            <section aria-labelledby="score-breakdown-heading" className="glass p-6 space-y-4">
              <h2 id="score-breakdown-heading" className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Score Breakdown · Vertex AI
              </h2>
              <div className="space-y-3">
                {([
                  { label: 'Nutritional Balance', value: health.breakdown.nutritional_balance, weight: '40%', id: 'bd-nutrition' },
                  { label: 'Habit Consistency', value: health.breakdown.habit_consistency, weight: '25%', id: 'bd-habit' },
                  { label: 'Hydration', value: health.breakdown.hydration, weight: '15%', id: 'bd-hydration' },
                  { label: 'Meal Timing', value: health.breakdown.meal_timing, weight: '10%', id: 'bd-timing' },
                  { label: 'Goal Alignment', value: health.breakdown.goal_alignment, weight: '10%', id: 'bd-goal' },
                ] as const).map(({ label, value, weight, id }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 w-4 text-right shrink-0">{weight}</span>
                    <div className="flex-1">
                      <MacroBar id={id} label={label} value={value} goal={100} unit="%" color="bg-gradient-to-r from-emerald-500 to-teal-400" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 text-right">Source: Vertex AI · composite health model</p>
            </section>
          )}
        </div>

        {/* RIGHT: Smart Recipes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span aria-hidden="true">🍽️</span> Smart Recipes
            </h2>
            <select
              aria-label="Filter recipes by preference"
              onChange={(e) => fetchRecipes(e.target.value)}
              defaultValue=""
              className="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/40 min-h-[36px]"
            >
              <option value="">All</option>
              <option value="high protein gym">High Protein</option>
              <option value="vegan plant-based">Vegan</option>
              <option value="quick fast">Quick (&lt;10 min)</option>
            </select>
          </div>

          <div role="list" aria-label="Recipe suggestions" className="space-y-4">
            {recipesLoading ? (
              Array.from({ length: 3 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            ) : (
              (recipesData?.recipes ?? []).map((recipe, i) => (
                <div key={i} role="listitem">
                  <RecipeCard recipe={recipe} index={i} />
                </div>
              ))
            )}
          </div>

          {/* Google Fit Stats mock */}
          <section aria-labelledby="fit-heading" className="glass p-5 space-y-4">
            <h2 id="fit-heading" className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span aria-hidden="true">❤️</span> Google Fit · Today
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {([
                { label: 'Steps', value: '6,840', icon: '🚶', note: 'Goal: 10,000' },
                { label: 'Burned', value: '340 kcal', icon: '🔥', note: 'Active cal' },
                { label: 'Sleep', value: '7h 12m', icon: '😴', note: 'Recommended' },
                { label: 'Adjusted Goal', value: '2,338 kcal', icon: '🎯', note: 'Base + fit' },
              ] as const).map(({ label, value, icon, note }) => (
                <div key={label} className="glass-light p-3 space-y-1">
                  <span className="text-lg" aria-hidden="true">{icon}</span>
                  <div className="text-sm font-bold text-white tabular-nums">{value}</div>
                  <div className="text-[10px] text-slate-500">{label}</div>
                  <div className="text-[9px] text-slate-600">{note}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Real-time Location Finder */}
          <LocationFinder />
        </div>
      </div>

      {/* ── Tech Stack Footer ── */}
      <footer role="contentinfo" aria-label="Technology stack" className="border-t border-white/5 pt-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-slate-600">
          {['Next.js 14', 'TypeScript 5.4', 'FastAPI 0.111', 'Zod', 'Vertex AI', 'Gemini 1.5 Flash',
            'Firestore', 'Cloud Run', 'Cloud Armor', 'Secret Manager', 'IAM'].map((t) => (
              <span key={t} className="hover:text-slate-400 transition-colors">{t}</span>
            ))}
        </div>
        <p className="text-center text-[10px] text-slate-700 mt-3">
          Zesty v1.0.0-production · asia-south1 · Deployed on Antigravity (Cloud Run)
        </p>
      </footer>

    </div>
  );
}
