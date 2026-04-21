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

import os
import json
import google.generativeai as genai
from fastapi import APIRouter, HTTPException

@router.post("/", response_model=RecipeResponse)
async def get_recipes(request: RecipeRequest) -> RecipeResponse:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise HTTPException(status_code=500, detail="Missing GEMINI_API_KEY environment variable. Recipe Engine requires Gemini.")
        
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"""
    The user requested recipes with the following preferences: "{request.preferences}"
    Provide exactly 3 healthy recipe suggestions.
    Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, no code blocks):
    {{
      "recipes": [
        {{
          "name": "<string>",
          "calories": <int>,
          "prep_time": <int>,
          "ingredients": ["<string>", ...],
          "steps": ["<string>", ...],
          "nutritional_note": "<short sentence about why it's healthy>",
          "tags": ["<string>", "<string>"]
        }}
      ]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        data = json.loads(text)
        recipes = data.get("recipes", [])
        
        parsed_recipes = []
        for r in recipes[:3]:
            parsed_recipes.append(RecipeItem(
                name=r.get("name", "Generated Recipe"),
                calories=r.get("calories", 300),
                prep_time=r.get("prep_time", 15),
                ingredients=r.get("ingredients", []),
                steps=r.get("steps", []),
                nutritional_note=r.get("nutritional_note", "A healthy AI-generated recipe."),
                tags=r.get("tags", ["healthy"])
            ))
            
        return RecipeResponse(recipes=parsed_recipes)
    except Exception as e:
        print(f"Gemini recipe error: {e}")
        # Fallback to local pool if AI fails
        pool = RECIPE_POOL
        if "protein" in request.preferences.lower():
            pool = [r for r in RECIPE_POOL if "protein" in (r.tags or [])]
        return RecipeResponse(recipes=pool[:3] if pool else RECIPE_POOL[:3])
