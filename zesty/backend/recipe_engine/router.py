from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RecipeRequest(BaseModel):
    preferences: str = "Healthy balanced meal"

class RecipeItem(BaseModel):
    name: str
    calories: int
    prep_time: int
    ingredients: list[str]
    steps: list[str]
    nutritional_note: str
    tags: list[str]

class RecipeResponse(BaseModel):
    recipes: list[RecipeItem]

RECIPE_POOL: list[RecipeItem] = [
    RecipeItem(
        name="Quick Paneer Stir Fry",
        calories=400, prep_time=15,
        ingredients=["100g Paneer", "1 Bell Pepper", "1 Onion", "2 tsp Oil", "Garam Masala", "Turmeric"],
        steps=["Cube paneer and dice vegetables.", "Heat oil in pan over medium-high.", "Sauté onion 3 min.", "Add peppers and spices, cook 4 min.", "Add paneer, toss and serve."],
        nutritional_note="High protein hit — closes your 25g protein gap for today.",
        tags=["high-protein", "vegetarian", "quick"],
    ),
    RecipeItem(
        name="Masoor Dal & Brown Rice",
        calories=450, prep_time=25,
        ingredients=["150g Masoor Dal", "100g Brown Rice", "1 Tomato", "Cumin Seeds", "1 tsp Ghee", "Salt"],
        steps=["Pressure cook dal 3 whistles.", "Cook rice separately.", "Temper cumin in ghee.", "Mix dal with tomato, simmer 5 min.", "Serve dal over rice."],
        nutritional_note="Complex carbs + legume protein — ideal for sustained energy.",
        tags=["high-fibre", "vegan", "comfort"],
    ),
    RecipeItem(
        name="Greek Yoghurt Protein Bowl",
        calories=280, prep_time=5,
        ingredients=["200g Greek Yoghurt (low-fat)", "1 Banana", "30g Granola", "1 tbsp Honey", "10 Walnuts"],
        steps=["Scoop yoghurt into bowl.", "Slice banana on top.", "Add granola and walnuts.", "Drizzle honey. Serve immediately."],
        nutritional_note="2× the protein of full-fat yoghurt at similar calories. Perfect post-workout.",
        tags=["high-protein", "no-cook", "probiotic"],
    ),
    RecipeItem(
        name="Spinach Egg Omelette",
        calories=210, prep_time=10,
        ingredients=["3 Eggs", "50g Spinach", "¼ Onion", "1 tsp Olive Oil", "Salt & Pepper"],
        steps=["Whisk eggs with salt and pepper.", "Sauté spinach and onion 2 min.", "Pour eggs over veggies.", "Fold and cook 3 min each side."],
        nutritional_note="Leafy greens + eggs provide iron, B12, and complete amino acids.",
        tags=["keto-friendly", "quick", "high-protein"],
    ),
    RecipeItem(
        name="Avocado & Chickpea Toast",
        calories=340, prep_time=8,
        ingredients=["2 slices Whole Wheat Bread", "½ Avocado", "50g Canned Chickpeas", "Lemon Juice", "Chilli Flakes"],
        steps=["Toast bread until golden.", "Mash avocado with lemon and salt.", "Drain and rinse chickpeas.", "Spread avocado on toast.", "Top with chickpeas and chilli."],
        nutritional_note="Healthy fats + fibre from chickpeas helps slow glucose absorption.",
        tags=["vegan", "high-fibre", "heart-healthy"],
    ),
]

@router.post("/", response_model=RecipeResponse)
async def get_recipes(request: RecipeRequest) -> RecipeResponse:
    prefs = request.preferences.lower()
    # Filter by tags if keywords matched
    if any(k in prefs for k in ["protein", "muscle", "gym"]):
        pool = [r for r in RECIPE_POOL if "high-protein" in (r.tags or [])]
    elif any(k in prefs for k in ["vegan", "plant"]):
        pool = [r for r in RECIPE_POOL if "vegan" in (r.tags or [])]
    elif any(k in prefs for k in ["quick", "fast"]):
        pool = [r for r in RECIPE_POOL if r.prep_time <= 10]
    else:
        pool = RECIPE_POOL

    # Return up to 3 recipes
    return RecipeResponse(recipes=pool[:3] if pool else RECIPE_POOL[:3])
