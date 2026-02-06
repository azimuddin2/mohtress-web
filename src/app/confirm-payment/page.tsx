'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PaymentSuccessPage = () => {
  const params = useSearchParams();
  const router = useRouter();

  const sessionId = params.get('sessionId');
  const paymentId = params.get('paymentId');

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown

  // 1️⃣ Fetch payment details from backend
  useEffect(() => {
    if (!sessionId || !paymentId) return;

    const fetchPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/confirm-payment?sessionId=${sessionId}&paymentId=${paymentId}`,
        );
        const data = await res.json();

        if (data.success) {
          setPayment(data.data);
        } else {
          router.push('/payment/failed');
        }
      } catch (err) {
        console.error(err);
        router.push('/payment/failed');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [sessionId, paymentId, router]);

  // 2️⃣ Auto redirect with countdown
  useEffect(() => {
    if (!payment) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/'); // Redirect to home/app
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [payment, router]);

  if (loading) return <p className="text-center mt-20">Verifying payment…</p>;
  if (!payment) return <p className="text-center mt-20">Payment not found</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4625A0] to-[#7c5cff] px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl text-center animate-fadeUp">
        {/* ✅ Success Icon */}
        <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
          ✓
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Payment Successful
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Thank you for trusting us. Redirecting to app in {countdown}{' '}
          seconds...
        </p>

        {/* Payment Info Card */}
        <div className="bg-gray-50 rounded-xl p-5 text-left text-sm">
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-medium text-gray-800">{payment.trnId}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium text-gray-800">${payment.amount}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Status</span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 capitalize">
              {payment.status}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-800">{payment.date}</span>
          </div>
        </div>

        {/* Go to App Button */}
        <a
          href="/"
          className="mt-6 block w-full py-3 rounded-xl bg-[#4625A0] text-white font-semibold hover:bg-[#361f85] transition"
        >
          Go to App
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
