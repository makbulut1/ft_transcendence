#!/bin/bash
# This script generate .env files and starts docker compose immediately.

./generate.sh
echo "Docker compose up..."
docker-compose up --build