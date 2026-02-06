'use server';

import { revalidateTag } from 'next/cache';
import { FieldValue, FieldValues } from 'react-hook-form';

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

    revalidateTag('BOOKINGS', 'default');

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const createPayment = async (data: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    revalidateTag('PAYMENT', 'default');

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
