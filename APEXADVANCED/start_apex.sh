#!/bin/bash

# Get the directory where this script is located
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "🚀 Starting ApexMoto Full Stack..."

# 1. Start Backend
echo "📦 Starting Backend on port 4000..."
cd "$PROJECT_ROOT/backend"
pnpm run dev &
BACKEND_PID=$!

# 2. Start Prisma Studio (Optional)
echo "💎 Starting Prisma Studio on port 5555..."
npx prisma studio --port 5555 &
STUDIO_PID=$!

# 3. Wait for backend to initialize
sleep 2

# 4. Start Frontend
echo "💻 Starting Frontend on port 3001..."
cd "$PROJECT_ROOT/apexmoto-platform-build"
PORT=3001 pnpm run dev

# Cleanup background processes when script is stopped
trap "kill $BACKEND_PID $STUDIO_PID 2>/dev/null || true" EXIT
