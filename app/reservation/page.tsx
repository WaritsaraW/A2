'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CarDetails from '../components/CarDetails';
import ReservationForm from '../components/ReservationForm';
import { ReservationFormData, Car, Order } from '@/lib/models';
import Link from 'next/link';

const ReservationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: number } | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ startDate: string; rentalPeriod: number } | null>(null);
  const [savedFormData, setSavedFormData] = useState<ReservationFormData | null>(null);
  
  const vin = searchParams.get('vin');

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      
      if (!vin) {
        setLoading(false);
        return;
      }

      try {
        // Fetch car data from API
        const response = await fetch(`/api/cars/${vin}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch car');
        }
        
        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [vin]);

  const handleSubmitReservation = async (formData: ReservationFormData) => {
    if (!car) return;
    
    // Save the form data for later use if user cancels
    setSavedFormData(formData);
    
    // Save the rental details for the confirmation page
    setOrderDetails({
      startDate: formData.startDate,
      rentalPeriod: formData.rentalPeriod
    });
    
    // Create order object
    const order = {
      customer: {
        name: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        driversLicenseNumber: formData.driversLicenseNumber
      },
      car: {
        vin: car.vin
      },
      rental: {
        startDate: formData.startDate,
        rentalPeriod: formData.rentalPeriod,
        totalPrice: car.pricePerDay * formData.rentalPeriod,
        orderDate: new Date().toISOString().split('T')[0]
      },
      status: 'pending' as const
    };
    
    setLoading(true);
    
    try {
      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const data = await response.json();
      setOrderSuccess({ orderId: data.id || Math.floor(Math.random() * 1000) + 1 });
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = () => {
    router.push('/');
  };

  const handleConfirmOrder = async () => {
    if (!orderSuccess) return;

    setLoading(true);

    try {
      // Confirm order (update status)
      const response = await fetch(`/api/orders/${orderSuccess.orderId}/confirm`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      // Show confirmation success page
      setConfirmSuccess(true);
    } catch (err) {
      console.error('Error confirming order:', err);
      setError('Failed to confirm reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to return to reservation form
  const handleReturnToForm = () => {
    // Save the form data back to localStorage before returning to the form
    if (savedFormData && car) {
      localStorage.setItem(`reservationFormData_${car.vin}`, JSON.stringify(savedFormData));
    }
    
    // Reset the orderSuccess state to return to the form
    setOrderSuccess(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen reservation-page">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no car selected, show message
  if (!vin) {
    return (
      <div className="bg-gray-50 min-h-screen reservation-page">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Car Selected</h2>
            <p className="text-gray-600 mb-6">
              Please select a car from the homepage to make a reservation.
            </p>
            <Link href="/" className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-200">
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If car not found or error
  if (!car || error) {
    return (
      <div className="bg-gray-50 min-h-screen reservation-page">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-6">
              {error || 'Car not found. It may have been removed or is no longer available.'}
            </p>
            <Link href="/" className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-200">
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If car is not available
  if (!car.available) {
    return (
      <div className="bg-gray-50 min-h-screen reservation-page">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <CarDetails car={car} />
          <div className="mt-6 bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Car Not Available</h2>
            <p className="text-gray-600 mb-6">
              Sorry, this car is no longer available for rent. Please choose another car.
            </p>
            <Link href="/" className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-200">
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If reservation confirmation succeeded
  if (confirmSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-sans">Order Confirmation</h1>
            <Link href="/" className="text-base text-gray-500 hover:text-gray-700 font-sans">← Back to home</Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-900 font-sans">Order Placed Successfully!</h2>
                  <p className="text-lg text-gray-500 font-sans">Your reservation has been confirmed and processed</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl tracking-wide text-gray-700 font-semibold font-sans mb-4" style={{ marginLeft: '1.5rem' }}>ORDER SUMMARY</h3>
                  {car && (
                    <div className="mb-4">
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>Order ID: {orderSuccess?.orderId}</div>
                      <div className="text-xl text-gray-800 font-medium font-sans" style={{ marginLeft: '1.5rem' }}>{car.brand} {car.carModel}</div>
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        Pickup Date: {new Date(orderDetails?.startDate || '').toLocaleDateString('en-AU')}
                      </div>
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        Rental Period: {orderDetails?.rentalPeriod || 0} day{(orderDetails?.rentalPeriod || 0) !== 1 ? 's' : ''}
                      </div>
                      <div className="mt-2 text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        <span className="font-semibold">${car.pricePerDay}</span> per day
                      </div>
                      <div className="mt-2 text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        <span className="font-semibold">Total Price:</span> ${car.pricePerDay * (orderDetails?.rentalPeriod || 0)}
                      </div>
                      <div className="mt-2 text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        <span className="font-semibold">Status:</span> <span style={{color: '#22c55e'}} className="font-bold">Confirmed</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0">
                  <h3 className="text-xl tracking-wide text-gray-700 font-semibold font-sans mb-4" style={{ marginLeft: '1.5rem' }}>NEXT STEPS</h3>
                  <p className="text-lg text-gray-600 mb-8 font-sans" style={{ marginLeft: '1.5rem' }}>
                    Your reservation has been confirmed. Thank you for your purchase! A confirmation email with all details has been sent to your email address.
                  </p>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full block px-8 py-5 text-white text-xl font-semibold rounded-lg transition duration-200 shadow-md font-sans"
                    style={{ backgroundColor: "#4369E5", color: "#ffffff", marginLeft: '1.5rem' }}
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If reservation was successfully created
  if (orderSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Reservation Details</h1>
            <Link href="/" className="text-base text-gray-500 hover:text-gray-700">← Back to home</Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-900 font-sans">Reservation #{orderSuccess.orderId} Created</h2>
                  <p className="text-lg text-gray-500 font-sans">Please review the details and confirm your reservation</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <div>
                  <h3 className="text-xl tracking-wide text-gray-700 font-semibold font-sans mb-4"  style={{ marginLeft: '1.5rem' }}>Reservation Summary</h3>
                  {car && (
                    <div className="mb-4">
                      <div className="text-xl text-gray-800 font-medium font-sans" style={{ marginLeft: '1.5rem' }}>{car.brand} {car.carModel}</div>
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>VIN: {car.vin}</div>
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        Pickup Date: {new Date(orderDetails?.startDate || '').toLocaleDateString('en-AU')}
                      </div>
                      <div className="text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        Rental Period: {orderDetails?.rentalPeriod || 0} day{(orderDetails?.rentalPeriod || 0) !== 1 ? 's' : ''}
                      </div>
                      <div className="mt-2 text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        <span className="font-semibold">${car.pricePerDay}</span> per day
                      </div>
                      <div className="mt-2 text-lg text-gray-800 font-sans" style={{ marginLeft: '1.5rem' }}>
                        <span className="font-semibold">Total Price:</span> ${car.pricePerDay * (orderDetails?.rentalPeriod || 0)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0">
                  <h3 className="text-xl tracking-wide text-gray-700 font-semibold font-sans mb-4">Next Steps</h3>
                  <p className="text-lg text-gray-600 mb-8 font-sans">
                    Confirm your reservation to finalize the booking process. You'll receive a confirmation email with all the details.
                  </p>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleConfirmOrder}
                      className="w-2/3 block px-6 py-4 text-white text-lg font-semibold rounded-lg transition duration-200 shadow-md font-sans"
                      style={{ backgroundColor: "#4369E5", color: "#ffffff" }}
                    >
                      Confirm Reservation
                    </button>
                    <button
                      onClick={handleReturnToForm}
                      className="w-1/3 block px-6 py-4 text-gray-600 text-lg font-medium rounded-lg transition duration-200 shadow-md font-sans border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reservation form
  return (
    <div className="bg-gray-50 min-h-screen py-4 reservation-page">
      <div className="container mx-auto px-6">
        <div className="py-3 border-b border-gray-200 mb-2">
          <Link 
            href="/" 
            className="inline-block px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-primary transition-colors"
          >
            ← Back to browse
          </Link>
        </div>
        
        <div className="py-4 mb-2">
          <h1 className="text-3xl font-bold mb-1">Reserve Your Car</h1>
          <p className="text-gray-600">Complete the form below to reserve {car.brand} {car.carModel}</p>
        </div>
        
        <table className="w-full mb-16" style={{ borderCollapse: 'separate', borderSpacing: '0 0' }}>
          <tbody>
            <tr className="align-stretch">
              <td className="align-top pr-6" width="66%" style={{ height: '100%', verticalAlign: 'top' }}>
                <div className="h-full">
                  <CarDetails car={car} />
                </div>
              </td>
              <td className="align-top" width="34%" style={{ height: '100%', verticalAlign: 'top' }}>
                <ReservationForm
                  car={car}
                  onSubmit={handleSubmitReservation}
                  onCancel={handleCancelReservation}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationPage; 