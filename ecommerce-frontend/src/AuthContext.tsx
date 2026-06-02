import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { api } from './api';
import { User } from './types';

interface JwtPayload {
  sub: string;
}

type LoginResult =
  | { success: true }
  | { success: false; error: string };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(savedToken);
          setUser({ email: decoded.sub });
        } catch (err) {
          console.error('Invalid token', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await api.post<{ access_token: string }>(
        '/token',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      setUser({ email });
      return { success: true };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Login failed:', err.response?.data?.detail ?? err.message);
        return { success: false, error: (err.response?.data?.detail as string) ?? 'Login failed' };
      }
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
