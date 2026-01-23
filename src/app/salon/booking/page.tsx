'use client';

import Spinner from '@/src/components/Spinner';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BookingPage = () => {
  const params = useSearchParams();
  const token = params.get('token');
  const serviceId = params.get('serviceId');

  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (!token || !serviceId) return;

    fetch(`http://10.10.10.73:5001/api/v1/qr-code/salon/${token}`)
      .then((res) => res.json())
      .then((res) => {
        const selectedService = res.data.services.find(
          (s: any) => s._id === serviceId,
        );
        setService(selectedService);
      });
  }, [token, serviceId]);

  if (!service) return <Spinner />;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg my-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Book Your Service
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Please provide your details to continue
      </p>

      {/* Service Summary */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
        <p className="font-medium text-gray-800">{service.name}</p>
        <p className="text-sm text-gray-500">
          {service.time} • ${service.price}
        </p>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4625A0] focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. (555) 123-4567"
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4625A0] focus:outline-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Date
          </label>
          <input
            type="date"
            placeholder="e.g. (555) 123-4567"
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4625A0] focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="
      w-full mt-6
      bg-[#4625A0]
      text-white
      py-3
      rounded-lg
      font-medium
      hover:opacity-90
      active:scale-95
      transition-all
    "
      >
        Confirm Booking
      </button>

      {/* Helper Text */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Walk-in bookings are added to the queue automatically
      </p>
    </div>
  );
};

export default BookingPage;
