#!/bin/bash
set -e

APP_DIR="$(pwd)"
FRONTEND_DIR="${APP_DIR}/myapp-frontend"
BACKEND_DIR="${APP_DIR}/myapp-backend"

echo "🚀 Starting deployment from $(pwd)"

# 1. Update system & install base tools
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git nginx build-essential

# 2. Install Node.js (LTS) & npm
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# 3. Install pm2 globally
sudo npm install -g pm2

# 4. Backend setup
echo "⚙️ Setting up backend..."
cd "${BACKEND_DIR}"
npm install

# Ensure .env exists (Terraform created it in backend dir)
if [ ! -f .env ]; then
  echo "❌ .env not found in backend. Aborting."
  exit 1
fi

# Start backend with pm2
pm2 start index.js --name myapp-backend --update-env || true

# 5. Frontend setup
echo "⚙️ Building frontend..."
cd "${FRONTEND_DIR}"
npm install
npm run build

# Copy frontend build to nginx html directory
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

# 6. Configure nginx
echo "⚙️ Configuring nginx..."
sudo tee /etc/nginx/sites-available/univ_app >/dev/null <<NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/univ_app /etc/nginx/sites-enabled/univ_app
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# 7. Ensure pm2 survives reboot
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "✅ Deployment completed!"
