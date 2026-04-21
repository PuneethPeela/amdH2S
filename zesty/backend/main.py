from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from food_log.router import router as food_log_router
from health_profile.router import router as health_profile_router
from recipe_engine.router import router as recipe_engine_router
from location.router import router as location_router

app = FastAPI(title="Zesty AI API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for hackathon, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(food_log_router, prefix="/api/food_log", tags=["Food Log"])
app.include_router(health_profile_router, prefix="/api/health_profile", tags=["Health Profile"])
app.include_router(recipe_engine_router, prefix="/api/recipe_engine", tags=["Recipe Engine"])
app.include_router(location_router, prefix="/api/location", tags=["Location Places"])

@app.get("/")
def read_root():
    return {"message": "Zesty AI API is running"}
