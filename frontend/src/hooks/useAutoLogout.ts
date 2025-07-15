// src/hooks/useAutoLogout.ts
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const useAutoLogout = (timeoutMinutes = 60) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = timeoutMinutes * 60 * 1000;
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('🔒 You have been logged out due to inactivity.');
        navigate({ to: '/login' });
      }, timeout);
    };

    // Reset on interaction
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer on mount

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timer) clearTimeout(timer);
    };
  }, [navigate, timeoutMinutes]);
};

export default useAutoLogout;
