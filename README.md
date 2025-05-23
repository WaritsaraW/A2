# Car Rental System

A modern car rental website built with Next.js and JSON data storage. This application allows users to browse, search, and rent cars with a streamlined user experience.

## Live Demo

Visit the live website: [DriveEase](https://a2-fawn-one.vercel.app)

## Features

- Browse cars by type or brand
- Search for cars using keywords with real-time suggestions
- Check car details and availability
- Place rental orders for available cars
- Confirm or cancel rental orders
- Form validation with real-time feedback
- Persistent form data when navigating away

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: 
  - Development: JSON files for data storage
  - Production: In-memory data storage with initial data loaded from JSON
- **Storage**: Local storage for form persistence
- **Deployment**: Azure App Service with PM2 process manager

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd car-rental-system
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

### Deploying with PM2

This project includes PM2 configuration for deploying on Azure App Service:

1. The `ecosystem.config.js` file configures PM2 to run the Next.js application
2. The `deploy.sh` script handles the installation and PM2 setup
3. The `web.config` file configures IIS on Azure App Service

To deploy to Azure App Service:

1. Connect your GitHub repository to Azure App Service
2. Set the startup command to:
   ```
   pm2 start ecosystem.config.js
   ```
3. Azure App Service will use the web.config file for routing

Alternatively, you can run the deploy script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Project Structure

- `/app`: Contains all React components and Next.js routes
  - `/components`: Reusable React components
  - `/api`: API routes
- `/lib`: Service functions and data handling
- `/public`: Static assets
  - `/images`: Car images
- `/data`: JSON data files

## Data Persistence

- Development environment:
  - Car and order data are stored in JSON files
  - JSON data is initialized with sample car data on first run
- Production environment (Vercel):
  - Data is stored in-memory during the application lifecycle
  - Initial car data is loaded from JSON files
  - Orders are stored in-memory only
- Form persistence:
  - User form input is saved in localStorage when navigating away from the reservation page 