export interface Car {
  id?: number;
  vin: string;
  carType: string;
  brand: string;
  carModel: string;
  image: string;
  yearOfManufacture: number;
  mileage: string;
  fuelType: string;
  available: boolean;
  pricePerDay: number;
  description?: string;
}

export interface Customer {
  name: string;
  phoneNumber: string;
  email: string;
  driversLicenseNumber: string;
}

export interface Rental {
  startDate: string;
  rentalPeriod: number;
  totalPrice: number;
  orderDate: string;
}

export interface Order {
  id?: number;
  customer: Customer;
  car: {
    vin: string;
  };
  rental: Rental;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ReservationFormData {
  customerName: string;
  phoneNumber: string;
  email: string;
  driversLicenseNumber: string;
  startDate: string;
  rentalPeriod: number;
}

export interface SearchFilters {
  carType?: string;
  brand?: string;
  query?: string;
} 