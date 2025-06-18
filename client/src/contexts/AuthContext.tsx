import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'applicant';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('AuthContext useEffect: token on mount', token);
      if (token) {
        try {
          const response = await auth.getProfile();
          console.log('AuthContext: User profile fetched:', response.data);
          const { _id, email, firstName, lastName, role } = response.data;
          const fetchedUserData: User = { _id, email, firstName, lastName, role };
          setUser(fetchedUserData);
        } catch (error) {
          console.error('AuthContext: Failed to fetch user profile:', error);
          setToken(null);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await auth.login(email, password);
      const { token: newToken, _id, firstName, lastName, email: userEmail, role } = response.data;
      
      if (!newToken || !_id) {
        throw new Error('Invalid response from server');
      }

      const userData: User = { _id, firstName, lastName, email: userEmail, role };

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      console.log('AuthContext: User logged in, token and user set:', { newToken, userData });
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sign in';
      throw new Error(errorMessage);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await auth.register(data);
      const { token: newToken, _id, firstName, lastName, email: userEmail, role } = response.data;
      
      if (!newToken || !_id) {
        throw new Error('Invalid response from server');
      }

      const userData: User = { _id, firstName, lastName, email: userEmail, role };

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      console.log('AuthContext: User registered, token and user set:', { newToken, userData });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 