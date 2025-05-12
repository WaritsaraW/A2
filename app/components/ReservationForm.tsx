'use client';

import React, { useState, useEffect } from 'react';
import { Car, ReservationFormData } from '@/lib/models';

interface ReservationFormProps {
  car: Car;
  onSubmit: (formData: ReservationFormData) => void;
  onCancel: () => void;
}

// Australian phone validation (allow +61 or 0 with area codes per checkout page)
const PHONE_REGEX = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

const ReservationForm: React.FC<ReservationFormProps> = ({ car, onSubmit, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ReservationFormData>({
    customerName: '',
    email: '',
    phoneNumber: '',
    driversLicenseNumber: '',
    startDate: today,
    rentalPeriod: 1
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});

  // Load saved form data from localStorage when component mounts
  useEffect(() => {
    // Use car-specific key for localStorage
    const storageKey = `reservationFormData_${car.vin}`;
    const savedFormData = localStorage.getItem(storageKey);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, [car.vin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name === 'rentalPeriod' ? parseInt(value) || 0 : value
    };
    
    setFormData(newFormData);
    
    // Save form data to localStorage with car-specific key whenever it changes
    localStorage.setItem(`reservationFormData_${car.vin}`, JSON.stringify(newFormData));
    
    // Clear existing error for this field
    if (errors[name as keyof ReservationFormData]) {
      setErrors(prev => ({ ...prev, [name as keyof ReservationFormData]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Australian phone number';
    }
    
    if (!formData.driversLicenseNumber.trim()) {
      newErrors.driversLicenseNumber = 'Driver\'s license is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }
    
    if (formData.rentalPeriod < 1) {
      newErrors.rentalPeriod = 'Rental period must be at least 1 day';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Do not clear localStorage here, let the parent component manage this
      // localStorage.removeItem('reservationFormData');
      onSubmit(formData);
    }
  };

  const totalPrice = car.pricePerDay * formData.rentalPeriod;

  return (
    <div className="bg-white border border-gray-200 rounded p-6">
      <h2 className="text-xl font-semibold mb-6">Reservation Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.customerName ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Please enter your full name"
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Please enter your email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="04xx xxx xxx"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>
            
            <div>
              <label htmlFor="driversLicenseNumber" className="block text-sm mb-1">
                Driver's License Number
              </label>
              <input
                type="text"
                id="driversLicenseNumber"
                name="driversLicenseNumber"
                value={formData.driversLicenseNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.driversLicenseNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="DL12345678"
              />
              {errors.driversLicenseNumber && <p className="mt-1 text-sm text-red-500">{errors.driversLicenseNumber}</p>}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Rental Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
            </div>
            
            <div>
              <label htmlFor="rentalPeriod" className="block text-sm mb-1">
                Rental Period (days)
              </label>
              <input
                type="number"
                id="rentalPeriod"
                name="rentalPeriod"
                value={formData.rentalPeriod}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border ${errors.rentalPeriod ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.rentalPeriod && <p className="mt-1 text-sm text-red-500">{errors.rentalPeriod}</p>}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Price Summary</h3>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Car Rental Rate</span>
              <span>${car.pricePerDay}/day</span>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <span>Rental Period</span>
              <span>{formData.rentalPeriod} day{formData.rentalPeriod !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex justify-between items-center font-semibold mt-1">
              <span>Total Price</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full flex mt-4" style={{ justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-primary rounded-full flex items-center justify-center"
            style={{ marginLeft: "auto" }}
          >
            <span>Complete Reservation</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm; 