import { useState, useCallback } from 'react';
import { validatePassword } from '../lib/supabase';

const SESSION_KEY = 'acm_board_session';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      return session === 'true';
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (password) => {
    setIsLoading(true);
    setError(null);
    try {
      const valid = await validatePassword(password);
      if (valid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Invalid password. Please try again.');
        return false;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, error, login, logout };
}
