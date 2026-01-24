'use client';

import Spinner from '@/src/components/Spinner';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';

const SalonDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qrToken = searchParams.get('qrToken');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!qrToken) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/qr-code/salon/${qrToken}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [qrToken]);

  const handelBooking = (data: string) => {
    console.log(data);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <p className="text-center mt-20 text-red-500">Invalid QR Code</p>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-md rounded-lg">
      {/* Salon Header */}
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <div className="flex-1">
          <Image
            src={data.salonPhoto || data.salonFrontPhoto}
            alt={data.salonName}
            className="w-full md:w-80 h-48 object-cover rounded-lg"
            width={300}
            height={200}
          />
        </div>
        <div className=" flex-1">
          <h1 className="text-3xl font-semibold text-gray-900 mt-2">
            {data.salonName}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{data.about}</p>
          <p className="text-sm text-gray-500 capitalize mt-3">
            Status: {data.approvalStatus}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <StarRatings
              rating={data.avgRating}
              starRatedColor="#F98600"
              numberOfStars={5}
              name="rating"
              starSpacing="1px"
              starDimension="18px"
            />
            <span className="text-sm text-gray-500">
              ({data.avgRating.toFixed(1)} out of {data.totalRatings} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-xl mt-6 mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          Opening Hours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.openingHours.map((day: any) => (
            <div
              key={day.day}
              className={`flex justify-between p-2 px-4 rounded ${
                day.enabled
                  ? 'bg-green-100 text-gray-900 font-medium'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              <span className="font-medium">{day.day}</span>
              <span>
                {day.enabled ? `${day.openTime} - ${day.closeTime}` : 'Closed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Services
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.services.map((s: any) => (
            <div
              key={s._id}
              className="shadow cursor-pointer rounded-lg p-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                {s.images?.[0]?.url && (
                  <Image
                    src={s.images[0].url}
                    alt={s.name}
                    className="w-16 h-16 object-cover rounded-md"
                    width={100}
                    height={100}
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-700">
                  {s.name}
                </h3>
              </div>
              <p className="text-gray-600">
                {s.category} - {s.subcategory}
              </p>
              <p className="mt-1 text-gray-800 font-medium">
                {s.time} | ${s.price}
              </p>
              <p className="mt-2 text-sm text-gray-500">{s.about}</p>
              <button
                onClick={() =>
                  router.push(
                    `/salon/booking?token=${qrToken}&serviceId=${s._id}`,
                  )
                }
                className="
    w-full mt-6 cursor-pointer
    bg-[#4625A0]
    text-white font-medium text-base
    py-2 px-6
    rounded
    hover:shadow-lg
    hover:scale-[1.02]
    active:scale-95
    transition-all duration-200
    focus:outline-none
  "
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mt-8">
        <h2 className="text-2xl text-gray-900 font-semibold mb-2">Location</h2>
        <p className="text-gray-600">{data.location?.streetAddress}</p>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-yellow-700 font-medium">Note: {data.notes}</p>
        </div>
      )}
    </div>
  );
};

export default SalonDetails;
