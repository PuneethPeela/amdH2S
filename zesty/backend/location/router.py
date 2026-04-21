import os
import requests
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Place(BaseModel):
    name: string
    address: string
    distance: string
    rating: float

class LocationResponse(BaseModel):
    places: List[Place]

@router.get("/nearby", response_model=LocationResponse)
async def get_nearby_healthy_places(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
):
    """
    Fetch nearby healthy food places using the Google Maps Places API.
    """
    maps_key = os.getenv("MAPS_API_KEY")
    if not maps_key:
        raise HTTPException(status_code=500, detail="Missing MAPS_API_KEY environment variable")

    # Using Google Places API Text Search or Nearby Search for healthy food/restaurants
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=2000&keyword=healthy+food&key={maps_key}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("status") != "OK" and data.get("status") != "ZERO_RESULTS":
            raise HTTPException(status_code=500, detail=f"Google API Error: {data.get('status')}")
            
        results = data.get("results", [])[:3] # Grab top 3
        places = []
        for r in results:
            places.append(Place(
                name=r.get("name", "Unknown Place"),
                address=r.get("vicinity", ""),
                distance="~1 km", # Mock distance as Maps doesn't give exact walking distance in standard nearby API without Distance Matrix
                rating=r.get("rating", 4.0)
            ))
            
        return LocationResponse(places=places)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
