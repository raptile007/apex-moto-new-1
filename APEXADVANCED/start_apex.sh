#!/bin/bash

echo "🚀 Starting ApexMoto Full Stack..."

# Start Backend in the background
echo "📦 Starting Backend on port 4000..."
cd /home/abhi/Desktop/apexzzz/APEXADVANCED/backend
pnpm run dev &

# Wait a second
sleep 2

# Start Frontend
echo "💻 Starting Frontend on port 3000..."
cd /home/abhi/Desktop/apexzzz/APEXADVANCED/apexmoto-platform-build
pnpm run dev
