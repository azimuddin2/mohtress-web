'use server';

import { FieldValues } from 'react-hook-form';

export const addBooking = async (data: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/bookings/walk-in`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

/*

{
  "vendor": "69298caad657f0fa8a3f95e9",
  "customer": "69298726d657f0fa8a3f95c0",
  "service": "692995a9d657f0fa8a3f96f8",
  "ownerReg": "69298caad657f0fa8a3f95e9",
  "serviceType": "OwnerService",
  "addOnServices": [
    {
      "name": "Extra Cleaning",
      "qty": 1,
      "price": 20
    }
  ],
  "email": "fanoc62655@fergetic.com",
  "date": "2026-01-17",
  "time": "03:00 PM - 04:00 PM",
  "specialist": "692995ecd657f0fa8a3f970d",
  "serviceLocation": "Customer Home",
  "notes": "Please arrive on time",
  "totalPrice": 150
}

*/
