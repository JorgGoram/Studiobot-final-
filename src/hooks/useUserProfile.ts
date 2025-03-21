import { useEffect, useState } from 'react';
import { UserProfile } from '../types/UserProfile';
import { loadUserProfile } from '../lib/supabase';

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfle = await loadUserProfile();
        setUser(userProfle);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return user;
};
