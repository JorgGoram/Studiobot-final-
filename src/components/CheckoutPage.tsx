import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, CreditCard } from 'lucide-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axiosConfig';

interface CheckoutPageProps {
  planId: 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  planName: string;
  planPrice: number;
  onBack: () => void;
}

export function CheckoutPage({
  planId,
  planName,
  planPrice,
  onBack,
}: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post(
        `/createPaymentIntent`,
        {
          plan_id: planId, // Amount in cents (e.g., $10.00)
          currency: 'usd'
        }
      );
      const { clientSecret } = data;
      console.log(clientSecret)
      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
          billing_details: {
            name: 'John Doe',
            address: {
              line1: '123 Main St',
              city: 'New York',
              state: 'NY',
              postal_code: '10001',
              country: 'US',
            },
            // Optional: Add user details if collected
          },
          metadata: {
            Plan: planId,
            Date: new Date().toDateString(),
            WebsiteName: 'https://studiobot.ai',
          },
        },
      });
      if (result?.error) {
        setError(result?.error.message || 'Payment failed');
      } else if (result?.paymentIntent.status === 'succeeded') {
        try {
          await api.post("/planUpdate", { paymentIntentId: result?.paymentIntent.id });
          toast.success('Payment successful! Redirecting to dashboard...');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
        catch (error: any) {
          // console.log(error);
          setError(error.message)
        }

      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process checkout'
      );
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 text-white bg-black">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center mb-8 transition-colors text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border bg-zinc-900/50 backdrop-blur-xl rounded-2xl border-zinc-800/50"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
            <p className="text-zinc-400">
              Complete your subscription to {planName}
            </p>
          </div>

          <div className="p-6 mb-8 border bg-black/30 rounded-xl border-zinc-800/50">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="flex items-center justify-between mb-4">
              <span>{planName} Plan</span>
              <span className="text-xl font-bold">${planPrice}/month</span>
            </div>
            <div className="text-sm text-zinc-400">
              Your subscription will begin immediately after successful payment
            </div>
          </div>

          <div className="mb-8 space-y-6">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Shield className="w-4 h-4 text-[#904af2]" />
              <span>
                Your payment is secured by industry-standard encryption
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Lock className="w-4 h-4 text-[#904af2]" />
              <span>
                Your data is protected and never stored on our servers
              </span>
            </div>
          </div>
          <div className="mb-8 p-6">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>
          {error && (
            <div className="p-4 mb-6 text-sm text-red-500 rounded-lg bg-red-500/10">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#904af2] text-white py-4 rounded-xl font-medium relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </div>
          </motion.button>

          <p className="mt-4 text-sm text-center text-zinc-500">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
