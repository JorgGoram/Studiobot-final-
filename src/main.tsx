import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { AuthCallback } from './routes/AuthCallback.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import './index.css';

// Create a router with lazy-loaded routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);