export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  authEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'openid',
  ],
  redirectUri: import.meta.env.DEV
    ? 'http://localhost:5173/auth/callback'
    : 'https://https://ai-agent-voice.netlify.app/auth/callback',
} as const;

export const SQUARE_CONFIG = {
  clientId: import.meta.env.VITE_SQUARE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SQUARE_CLIENT_SECRET,
  scopes: ['APPOINTMENTS_READ', 'APPOINTMENTS_WRITE', 'CUSTOMERS_READ', 'CUSTOMERS_WRITE'],
  redirectUri: import.meta.env.DEV
    ? 'http://localhost:5173/auth/callback'
    : 'https://https://ai-agent-voice.netlify.app/auth/callback',
} as const;