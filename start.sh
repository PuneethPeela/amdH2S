#!/bin/bash
# start.sh
# 1. Start the FastAPI backend in the background on port 8000
cd /app/backend
uvicorn main:app --host 127.0.0.1 --port 8000 &

# 2. Wait a brief moment to ensure backend initializes
sleep 2

# 3. Start the Next.js frontend in the foreground
cd /app/frontend
# $PORT is automatically injected by Google Cloud Run. 
# Defaults to 8080 if not defined.
export PORT=${PORT:-8080}
npm start -- -p $PORT
