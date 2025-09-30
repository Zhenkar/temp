#!/bin/bash
set -e

APP_DIR="$(pwd)"
FRONTEND_DIR="${APP_DIR}/myapp-frontend"
BACKEND_DIR="${APP_DIR}/myapp-backend"

echo "🚀 Starting deployment from $(pwd)"

# 1. Update system & install base tools
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential

# 2. Install Node.js (LTS) & npm if not already installed
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# 3. Install pm2 globally (to run backend as a service)
if ! command -v pm2 >/dev/null 2>&1; then
  echo "📦 Installing pm2..."
  sudo npm install -g pm2
fi

# 4. Backend setup
echo "⚙️ Setting up backend..."
cd "${BACKEND_DIR}"
npm install

# Ensure .env exists (Terraform should have created it in backend dir)
if [ ! -f .env ]; then
  echo "❌ .env not found in backend. Aborting."
  exit 1
fi

# Restart backend with pm2
pm2 delete myapp-backend || true
pm2 start index.js --name myapp-backend --update-env
pm2 save

# 5. Frontend setup
echo "⚙️ Building frontend..."
cd "${FRONTEND_DIR}"
npm install
npm run build

# Copy frontend build to nginx html directory
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

# 6. Restart nginx to ensure latest config is active
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "👉 Backend running on :5000 (proxied as /api)"
echo "👉 Frontend served at http://<EC2_PUBLIC_IP>/"
