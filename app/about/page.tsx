import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Our Car Rental Service</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          Our mission is to provide reliable, affordable, and convenient car rental services to our customers. 
          We believe that everyone deserves access to quality transportation solutions, and we strive to make 
          the rental process as simple and hassle-free as possible.
        </p>
        <p className="text-gray-700">
          Whether you need a car for a business trip, family vacation, or just a weekend getaway, 
          our diverse fleet of vehicles ensures that you'll find the perfect match for your needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Fleet</h2>
          <p className="text-gray-700 mb-4">
            We take pride in our well-maintained fleet of vehicles, which includes:
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li className="mb-2">Compact and economy cars for budget-conscious travelers</li>
            <li className="mb-2">Comfortable sedans for business travelers and small families</li>
            <li className="mb-2">Spacious SUVs for family trips and outdoor adventures</li>
            <li className="mb-2">Luxury models for special occasions and executive travel</li>
            <li>Hybrid vehicles for eco-conscious customers</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">Transparent pricing:</span> No hidden fees or surprise charges
            </li>
            <li className="mb-2">
              <span className="font-medium">Flexible rental periods:</span> From 1 day to 30 days
            </li>
            <li className="mb-2">
              <span className="font-medium">Convenient online booking:</span> Reserve your car in minutes
            </li>
            <li className="mb-2">
              <span className="font-medium">24/7 customer support:</span> We're always here to help
            </li>
            <li>
              <span className="font-medium">Comprehensive insurance:</span> Drive with peace of mind
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Main Office</h3>
            <address className="not-italic text-gray-700">
              123 Rental Avenue<br />
              Suite 456<br />
              Metro City, MC 12345<br />
              <a href="tel:+15551234567" className="text-primary hover:underline">Phone: (555) 123-4567</a>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Business Hours</h3>
            <ul className="text-gray-700">
              <li className="flex justify-between mb-1">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between mb-1">
                <span>Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Get In Touch</h3>
          <p className="text-gray-700 mb-4">
            Have questions or need assistance? We're here to help! Feel free to contact our customer support team.
          </p>
          <div className="flex space-x-4">
            <a href="mailto:info@carrentalsystem.com" className="btn btn-primary">
              Email Us
            </a>
            <a href="tel:+15551234567" className="btn btn-secondary">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 