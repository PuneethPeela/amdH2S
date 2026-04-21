# 🥗 Zesty – AI-Powered Nutrition Intelligence

> Hackathon project · AMD × Google Cloud

Zesty is a production-grade, fullstack nutrition tracking app powered by Google Gemini AI. Log meals in natural language, get real-time macro breakdowns, AI recipe suggestions, and personalized health scores.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14, TypeScript, TailwindCSS |
| Backend   | FastAPI (Python 3.11), Uvicorn      |
| AI        | Google Gemini API                   |
| Database  | Google Cloud Firestore              |
| Infra     | Docker, Google Cloud Run            |

## Prerequisites

- Docker ≥ 24 & Docker Compose
- API keys for Gemini, Firebase, and Google Maps

## Quick Start (Docker Compose)

```bash
# 1. Clone the repo
git clone https://github.com/PuneethPeela/amdH2S.git
cd amdH2S

# 2. Configure backend secrets
cp zesty/backend/.env.example zesty/backend/.env
# Edit zesty/backend/.env and fill in:
#   GEMINI_API_KEY=...
#   FIREBASE_SERVICE_ACCOUNT=...
#   MAPS_API_KEY=...

# 3. Start both services
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
```

## Project Structure

```
AMD-slingshot/
├── docker-compose.yml
└── zesty/
    ├── backend/          # FastAPI app
    │   ├── food_log/
    │   ├── health_profile/
    │   ├── recipe_engine/
    │   ├── main.py
    │   └── Dockerfile
    ├── frontend/         # Next.js app
    │   ├── app/
    │   ├── components/
    │   └── Dockerfile
    └── infra/
        └── cloudbuild/   # Google Cloud Build config
```

## Cloud Deployment (Google Cloud Run)

See `zesty/infra/cloudbuild/cloudbuild.yaml`. Set `_PROJECT_ID` substitution to your GCP project.

## License

MIT
