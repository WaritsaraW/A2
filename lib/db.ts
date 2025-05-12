import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'car-rental.db');
const db = new Database(dbPath);

// Initialize database tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vin TEXT UNIQUE NOT NULL,
    carType TEXT NOT NULL,
    brand TEXT NOT NULL,
    carModel TEXT NOT NULL,
    image TEXT NOT NULL,
    yearOfManufacture INTEGER NOT NULL,
    mileage TEXT NOT NULL,
    fuelType TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT 1,
    pricePerDay REAL NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT NOT NULL,
    driversLicenseNumber TEXT NOT NULL,
    carVin TEXT NOT NULL,
    startDate TEXT NOT NULL,
    rentalPeriod INTEGER NOT NULL,
    totalPrice REAL NOT NULL,
    orderDate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (carVin) REFERENCES cars(vin)
  );
`);

// Check if cars table is empty, if so import sample data
const carCount = db.prepare('SELECT COUNT(*) as count FROM cars').get() as { count: number };

if (carCount.count === 0) {
  // Import sample cars from cars.json
  try {
    const carsJson = fs.readFileSync(path.join(process.cwd(), 'cars.json'), 'utf-8');
    const carsData = JSON.parse(carsJson);
    
    const insertCar = db.prepare(`
      INSERT INTO cars (vin, carType, brand, carModel, image, yearOfManufacture, mileage, fuelType, available, pricePerDay, description)
      VALUES (@vin, @carType, @brand, @carModel, @image, @yearOfManufacture, @mileage, @fuelType, @available, @pricePerDay, @description)
    `);
    
    const insertMany = db.transaction((cars) => {
      for (const car of cars) {
        insertCar.run(car);
      }
    });
    
    insertMany(carsData.cars);
  } catch (error) {
    console.error('Error importing sample car data:', error);
  }
}

export default db; 