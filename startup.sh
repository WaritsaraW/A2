#!/bin/bash

# Navigate to app directory - this should be where your code is deployed
cd /home/site/wwwroot

# Install dependencies if not already installed
npm install --production

# Build the Next.js application
npm run build

# Install PM2 globally if not already installed
npm install pm2 -g

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list and resources for automatic respawn
pm2 save

# Show logs
pm2 logs --lines 100 