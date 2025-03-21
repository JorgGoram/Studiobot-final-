import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthenticated = !!session;
      setUser(isAuthenticated);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <>
      <UserDashboard />
      <Toaster />
    </>
  );
}

export default App;
