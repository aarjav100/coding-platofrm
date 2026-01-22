import { useState, useEffect } from 'react';

type AppRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
        setRole(userInfo.role || 'user');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth); // Listen for storage changes
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const isAdmin = role === 'admin';
  const isModerator = role === 'admin'; // For compatibility

  return { user, role, loading, isAdmin, isModerator };
};
