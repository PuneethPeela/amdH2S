from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os, random, datetime

router = APIRouter()

# ─── Indian nutrition reference DB (minimal inline for hackathon) ─────────────
FOOD_DB: dict[str, dict] = {
    "chicken salad":   {"calories": 320, "protein": 28, "carbs": 12, "fat": 18, "fibre": 3},
    "dal rice":        {"calories": 410, "protein": 16, "carbs": 72, "fat": 7, "fibre": 8},
    "idli sambar":     {"calories": 290, "protein": 9, "carbs": 55, "fat": 4, "fibre": 5},
    "roti sabzi":      {"calories": 350, "protein": 10, "carbs": 55, "fat": 9, "fibre": 6},
    "banana":          {"calories": 90, "protein": 1, "carbs": 23, "fat": 0, "fibre": 3},
    "paneer stir fry": {"calories": 380, "protein": 22, "carbs": 14, "fat": 26, "fibre": 4},
    "oatmeal":         {"calories": 300, "protein": 10, "carbs": 54, "fat": 6, "fibre": 8},
    "egg omelette":    {"calories": 210, "protein": 14, "carbs": 4, "fat": 15, "fibre": 1},
    "avocado toast":   {"calories": 310, "protein": 8, "carbs": 35, "fat": 16, "fibre": 7},
    "greek yoghurt":   {"calories": 130, "protein": 18, "carbs": 8, "fat": 2, "fibre": 0},
    "biryani":         {"calories": 520, "protein": 22, "carbs": 68, "fat": 18, "fibre": 3},
    "dosa":            {"calories": 240, "protein": 5, "carbs": 40, "fat": 7, "fibre": 2},
    "upma":            {"calories": 260, "protein": 7, "carbs": 38, "fat": 8, "fibre": 4},
    "salad":           {"calories": 150, "protein": 4, "carbs": 18, "fat": 7, "fibre": 5},
    "pizza slice":     {"calories": 285, "protein": 12, "carbs": 36, "fat": 10, "fibre": 2},
    "burger":          {"calories": 490, "protein": 26, "carbs": 45, "fat": 22, "fibre": 3},
}

# In-memory session log (reset per server restart — use Firestore in production)
_today_log: list[dict] = []
_goal_calories: int = 2100

class FoodLogRequest(BaseModel):
    query: str = Field(min_length=2, max_length=500)

class FoodLogResponse(BaseModel):
    calories: int
    protein:  float
    carbs:    float
    fat:      float
    fibre:    float
    item_name: str
    message:   str
    allergy_alert: str | None = None

class DailySummary(BaseModel):
    logs: list[dict]
    total_calories: float
    total_protein:  float
    total_carbs:    float
    total_fat:      float
    goal_calories:  int
    streak:         int

def _fuzzy_match(query: str) -> tuple[str, dict] | None:
    """Simple keyword match against the food DB."""
    q = query.lower()
    for key, nutrients in FOOD_DB.items():
        if key in q or any(word in q for word in key.split()):
            return key, nutrients
    return None

@router.post("/", response_model=FoodLogResponse)
async def log_food(request: FoodLogRequest) -> FoodLogResponse:
    match = _fuzzy_match(request.query)

    if match:
        key, n = match
        item_name = key.title()
        calories, protein, carbs, fat, fibre = (
            n["calories"], n["protein"], n["carbs"], n["fat"], n["fibre"]
        )
    else:
        # Intelligent fallback — estimate based on keyword density
        words = request.query.lower().split()
        multiplier = 2 if any(w in words for w in ["large", "big", "double"]) else 0.7 if any(w in words for w in ["small", "half"]) else 1.0
        calories = int(350 * multiplier)
        protein, carbs, fat, fibre = int(15 * multiplier), int(40 * multiplier), int(12 * multiplier), int(4 * multiplier)
        item_name = request.query.strip().title()[:40]

    entry = {
        "id": f"log_{len(_today_log)+1}",
        "item_name": item_name,
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fat": fat,
        "fibre": fibre,
        "logged_at": datetime.datetime.now().isoformat(),
    }
    _today_log.append(entry)

    total_cal = sum(e["calories"] for e in _today_log)
    pct = round(total_cal / _goal_calories * 100)

    over_msg = ""
    if total_cal > _goal_calories * 1.2:
        over_msg = f" — you're at {pct}% of your goal today. Want a lighter dinner suggestion?"

    return FoodLogResponse(
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        fibre=fibre,
        item_name=item_name,
        message=f"Logged: {item_name} · Daily total {total_cal}/{_goal_calories} kcal ({pct}%){over_msg}",
    )

@router.get("/summary", response_model=DailySummary)
async def summary() -> DailySummary:
    total_cal = sum(e["calories"] for e in _today_log)
    total_pro = sum(e["protein"] for e in _today_log)
    total_carbs = sum(e["carbs"] for e in _today_log)
    total_fat = sum(e["fat"] for e in _today_log)
    return DailySummary(
        logs=_today_log,
        total_calories=total_cal,
        total_protein=total_pro,
        total_carbs=total_carbs,
        total_fat=total_fat,
        goal_calories=_goal_calories,
        streak=7,
    )
