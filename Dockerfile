# Use a slim Python 3.11 as the base image
FROM python:3.11-slim

# Install system dependencies (Node.js and bash)
RUN apt-get update && apt-get install -y curl bash \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---- 1. SETUP BACKEND ----
COPY zesty/backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY zesty/backend backend/

# ---- 2. SETUP FRONTEND ----
COPY zesty/frontend/package*.json frontend/
RUN cd frontend && npm install
COPY zesty/frontend frontend/

# Build the Next.js production server
RUN cd frontend && npm run build

# ---- 3. SETUP ENRTYPOINT ----
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Cloud Run sets the PORT env variable automatically
CMD ["/app/start.sh"]
