import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { TOKEN_KEY, authAxios, clearSession } from '../api/axiosInstance';

const USER_KEY = 'shuttlex_user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = useCallback((authData) => {
    const userData = {
      userId: authData.userId,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      role: authData.role,
    };

    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setError(null);
    return userData;
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAxios.post('/auth/login', { email, password });
      return persistSession(data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Giriş başarısız. E-posta veya şifreyi kontrol edin.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAxios.post('/auth/register', payload);
      return persistSession(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Kayıt işlemi başarısız.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user && localStorage.getItem(TOKEN_KEY)),
      isCustomer: user?.role === 'CUSTOMER',
      isDriver: user?.role === 'DRIVER',
      login,
      register,
      logout,
      clearError: () => setError(null),
    }),
    [user, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth yalnızca AuthProvider içinde kullanılabilir.');
  }
  return context;
}
