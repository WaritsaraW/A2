# Car Rental System

A modern car rental website built with Next.js and SQLite. This application allows users to browse, search, and rent cars with a streamlined user experience.

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
- **Database**: SQLite (using better-sqlite3)
- **Storage**: Local storage for form persistence

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

## Project Structure

- `/app`: Contains all React components and Next.js routes
  - `/components`: Reusable React components
  - `/api`: API routes
- `/lib`: Database and service functions
- `/public`: Static assets
  - `/images`: Car images
- `/data`: SQLite database file (created at runtime)

## Data Persistence

- Car and order data are stored in an SQLite database
- SQLite database is initialized with sample car data on first run
- User form input is saved in localStorage when navigating away from the reservation page 