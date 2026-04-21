from fastapi import APIRouter
from pydantic import BaseModel
import math

router = APIRouter()

# Shared reference to food_log session (import from food_log.router in prod Firestore)
# For hackathon: directly import module-level log
from food_log.router import _today_log, _goal_calories

class HealthScoreBreakdown(BaseModel):
    nutritional_balance: float
    habit_consistency: float
    hydration: float
    meal_timing: float
    goal_alignment: float

class DailyTotals(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    fibre: float
    goal_calories: int
    goal_protein: int

class HealthScoreResponse(BaseModel):
    score: int
    trend: str
    insights: list[str]
    breakdown: HealthScoreBreakdown
    daily_totals: DailyTotals

def _compute_score(logs: list[dict], goal_cal: int) -> tuple[int, str, HealthScoreBreakdown]:
    total_cal = sum(e["calories"] for e in logs)
    total_pro = sum(e["protein"] for e in logs)
    goal_pro = 80  # grams

    # Nutritional balance (40% weight) — based on macro distribution
    cal_ratio = min(total_cal / goal_cal, 1.0) if goal_cal else 0
    pro_ratio = min(total_pro / goal_pro, 1.0) if goal_pro else 0
    nutritional_balance = round((cal_ratio * 0.5 + pro_ratio * 0.5) * 100, 1)

    # Habit consistency (25% weight) — proxy: meals logged today
    meal_count = len(logs)
    habit_consistency = round(min(meal_count / 3, 1.0) * 100, 1)

    # Hydration (15% weight) — static baseline for hackathon MVP
    hydration = 75.0

    # Meal timing (10%) — reward if meals spread >2h apart
    if len(logs) >= 2:
        meal_timing = 80.0
    else:
        meal_timing = 50.0

    # Goal alignment (10%)
    goal_alignment = round((1 - abs(cal_ratio - 1)) * 100, 1)

    composite = (
        nutritional_balance * 0.40 +
        habit_consistency   * 0.25 +
        hydration           * 0.15 +
        meal_timing         * 0.10 +
        goal_alignment      * 0.10
    )
    score = max(0, min(100, round(composite)))
    trend = "up" if score >= 70 else "down" if score < 50 else "stable"
    return score, trend, HealthScoreBreakdown(
        nutritional_balance=nutritional_balance,
        habit_consistency=habit_consistency,
        hydration=hydration,
        meal_timing=meal_timing,
        goal_alignment=goal_alignment,
    )

import os
import json
import google.generativeai as genai
from fastapi import HTTPException

def _generate_insights(logs: list[dict], score: int) -> list[str]:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("Missing GEMINI_API_KEY, using fallback insights")
        return ["Your nutrition insights require a Gemini API key.", "Add it to your backend .env file."]
        
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        Analyze this user's food logs for today: {str(logs)[:500]}. 
        Their overall health score is {score}/100.
        Provide 3 brief, actionable, and personalized nutrition insights.
        Return ONLY a JSON object matching this schema exactly (no markdown formatting, no code blocks):
        {{
            "insights": ["<insight 1>", "<insight 2>", "<insight 3>"]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        data = json.loads(text)
        return data.get("insights", ["Eat more greens.", "Stay hydrated.", "Aim for 80g of protein."])[:3]
    except Exception as e:
        print(f"Gemini insight error: {e}")
        return ["Add a source of lean protein.", "Drink more water today.", "Consider a fiber-rich snack."]

@router.get("/", response_model=HealthScoreResponse)
async def get_health_profile() -> HealthScoreResponse:
    score, trend, breakdown = _compute_score(_today_log, _goal_calories)
    insights = _generate_insights(_today_log, score)
    total_cal = sum(e["calories"] for e in _today_log)
    total_pro = sum(e["protein"] for e in _today_log)
    total_carbs = sum(e["carbs"] for e in _today_log)
    total_fat = sum(e["fat"] for e in _today_log)
    total_fibre = sum(e["fibre"] for e in _today_log)

    return HealthScoreResponse(
        score=score,
        trend=trend,
        insights=insights,
        breakdown=breakdown,
        daily_totals=DailyTotals(
            calories=total_cal,
            protein=total_pro,
            carbs=total_carbs,
            fat=total_fat,
            fibre=total_fibre,
            goal_calories=_goal_calories,
            goal_protein=80,
        ),
    )
