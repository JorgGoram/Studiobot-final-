import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if this is a Google Calendar callback
        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        const code = params.get('code');
        const storedGoogleState = localStorage.getItem('googleCalendarState');
        const storedSquareState = localStorage.getItem('squareCalendarState');

        // Handle Google Calendar OAuth callback
        if (state && code && state === storedGoogleState) {
          localStorage.removeItem('googleCalendarState');
          localStorage.setItem('googleAccessToken', code);
          setSuccessMessage('Google Calendar');
          setShowSuccess(true);
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'GOOGLE_CALENDAR_SUCCESS',
                code: code,
              },
              window.location.origin
            );

            // Keep window open longer to show success message
            setTimeout(() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }, 5000); // 5 seconds to show success message

            return;
          }
        }

        // Handle Square Calendar OAuth callback
        if (state && code && state === storedSquareState) {
          localStorage.removeItem('squareCalendarState');
          localStorage.setItem('squareAccessToken', code);

          setSuccessMessage('Square Calendar');
          setShowSuccess(true);

          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'SQUARE_CALENDAR_SUCCESS',
                code: code,
              },
              window.location.origin
            );

            // Keep window open longer to show success message
            setTimeout(() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }, 5000); // 5 seconds to show success message

            return;
          }
        }

        // Handle regular auth callback
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase auth error:', error);
          setErrorMessage(error.message);
          throw error;
        }

        if (!session) {
          if (location.hash || location.search) {
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(window.location.href);
            if (exchangeError) {
              console.error('Token exchange error:', exchangeError);
              setErrorMessage(exchangeError.message);
              throw exchangeError;
            }
          }
        }

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        setErrorMessage(error.message || 'Authentication failed');

        // Send error message to parent window for calendar integration
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'CALENDAR_ERROR',
              error: error.message,
            },
            window.location.origin
          );

          // Keep window open to show error message
          setTimeout(() => {
            window.close();
          }, 5000);
        } else {
          navigate('/?error=auth_callback_error', { replace: true });
        }
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Connection Successful!
          </h1>
          <p className="text-zinc-400">
            Your {successMessage} has been connected.
          </p>
          <p className="text-sm text-zinc-500">
            This window will close automatically in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Connection Failed</h1>
          <p className="text-zinc-400">{errorMessage}</p>
          <p className="text-sm text-zinc-500">
            This window will close automatically...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#904AF2] mx-auto mb-4"></div>
        <p className="text-zinc-400">Completing authentication...</p>
      </div>
    </div>
  );
}
