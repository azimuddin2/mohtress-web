'use client';

import Spinner from '@/src/components/Spinner';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type BookingFormValues = {
  customerName: string;
  phone: string;
  email: string;
  date: string;
  specialist: string;
};

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Your name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  date: z.string().min(1, 'Booking date is required'),
  specialist: z.string().min(1, 'Please select a specialist'),
});

const Booking = () => {
  const params = useSearchParams();
  const token = params.get('token');
  const serviceId = params.get('serviceId');
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      date: '',
      specialist: '',
    },
  });

  useEffect(() => {
    if (!token || !serviceId) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/qr-code/salon/${token}`)
      .then((res) => res.json())
      .then((res) => {
        const selectedService = res.data.services.find(
          (s: any) => s._id === serviceId,
        );
        setService(selectedService);
      })
      .finally(() => setLoading(false));
  }, [token, serviceId]);

  useEffect(() => {
    if (!service?.owner) return;

    fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/specialists?owner=${service.owner}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setSpecialists(res.data || []);
      });
  }, [service]);

  const onSubmit = async (values: BookingFormValues) => {
    const payload = {
      ...values,
      token,
      serviceId,
    };

    console.log('Booking Payload:', payload);

    // await fetch('/api/booking', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });

    // router.push('/booking/success');
  };

  if (loading || !service) return <Spinner />;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg my-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Book Your Service
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Please provide your details to continue
      </p>

      {/* Service Info */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border flex items-center gap-4">
        <Image
          src={service.images?.[0]?.url || '/placeholder.png'}
          alt={service.name}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        <div>
          <p className="font-medium text-gray-800">{service.name}</p>
          <p className="text-sm text-gray-500">
            {service.time} • ${service.price}
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Specialist Selection */}
          {specialists.length > 0 && (
            <FormField
              control={form.control}
              name="specialist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Specialist</FormLabel>

                  <div className="grid grid-cols-2 gap-2">
                    {specialists.map((specialist: any) => {
                      const selected = field.value === specialist._id;

                      return (
                        <div
                          key={specialist._id}
                          onClick={() => field.onChange(specialist._id)}
                          className={`cursor-pointer border rounded p-3 flex items-center gap-3
                            ${
                              selected
                                ? 'border-[#4625A0] bg-purple-50'
                                : 'border-gray-200'
                            }
                          `}
                        >
                          <Image
                            src={specialist.image || '/default-specialist.png'}
                            alt={specialist.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <p className="font-medium text-gray-800">
                            {specialist.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Name */}
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="rounded py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...field}
                    className="rounded py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="rounded py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#4625A0] hover:bg-[#3a1f85] rounded py-5"
          >
            Confirm Booking
          </Button>
        </form>
      </Form>

      <p className="text-xs text-gray-400 text-center mt-4">
        Walk-in bookings are added to the queue automatically
      </p>
    </div>
  );
};

export default Booking;
