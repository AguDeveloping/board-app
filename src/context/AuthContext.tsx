import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getToken, getUser, isAuthenticated, logout, User } from '../services/auth/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
  setAuthInfo: (isAuth: boolean, user: User | null) => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  setAuthInfo: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null as User | null,
    loading: true
  });

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getUser();
      
      setAuth({
        isAuthenticated: authenticated,
        user: user,
        loading: false
      });
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  const setAuthInfo = (isAuth: boolean, user: User | null) => {
    setAuth({
      isAuthenticated: isAuth,
      user: user,
      loading: false
    });
  };

  const value = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    logout: handleLogout,
    setAuthInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
