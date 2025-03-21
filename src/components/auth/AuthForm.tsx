import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../../lib/google';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthForm({ type, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (type === 'signup' && !acceptedTerms) {
      setError('Please accept the terms of service to continue');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              email_confirmed: true,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message === 'User already registered') {
            throw new Error('An account with this email already exists');
          }
          throw signUpError;
        }
        onSuccess?.();
        // window.location.href = window.origin;
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password');
          }
          throw signInError;
        }

        if (data.user) {
          onSuccess?.();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-gray-800 transition-all bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continue with Google
      </motion.button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-zinc-900 text-zinc-400">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 p-3 text-sm text-red-500 rounded-lg bg-red-500/10"
            >
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block mb-2 text-sm font-medium">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2] transition-all"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
            <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block mb-2 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2] transition-all"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={loading}
            />
            <Lock className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
          </div>
        </motion.div>

        {type === 'signup' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="terms" className="text-sm">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(!showTerms)}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300"
                  >
                    terms of service
                  </button>
                </label>

                <AnimatePresence>
                  {showTerms && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 mt-3 overflow-y-auto text-sm border rounded-lg bg-black/30 border-zinc-800 text-zinc-400 max-h-60">
                        <h3 className="mb-2 font-medium text-white">
                          User Agreement
                        </h3>

                        <div className="space-y-4">
                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              1. Acceptance of Terms
                            </h4>
                            <p>
                              By using the Blackwork AI website, services, or
                              products, you agree to be bound by this User
                              Agreement and our Privacy Policy.
                            </p>
                          </section>

                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              2. Services Provided
                            </h4>
                            <p>
                              Blackwork AI provides AI voice agent solutions for
                              the tattoo industry, including:
                            </p>
                            <ul className="mt-1 ml-4 list-disc">
                              <li>Client Communication</li>
                              <li>Appointment Management</li>
                              <li>Event Management</li>
                            </ul>
                          </section>

                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              3. User Responsibilities
                            </h4>
                            <p>
                              Users must provide accurate information and use
                              services lawfully.
                            </p>
                          </section>

                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              4. Data Privacy
                            </h4>
                            <p>
                              Your data is protected under our Privacy Policy
                              and industry-standard security measures.
                            </p>
                          </section>

                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              5. Subscription
                            </h4>
                            <p>
                              Access requires a subscription with monthly or
                              annual billing options.
                            </p>
                          </section>

                          <section>
                            <h4 className="mb-1 font-medium text-white">
                              Contact
                            </h4>
                            <p>For questions: info@blackworkai.com</p>
                          </section>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || (type === 'signup' && !acceptedTerms)}
          className="w-full bg-[#904AF2] text-white py-2 px-4 rounded-lg hover:bg-[#904AF2]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {type === 'signup' ? 'Creating account...' : 'Logging in...'}
            </>
          ) : (
            <>{type === 'signup' ? 'Create Account' : 'Log In'}</>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}