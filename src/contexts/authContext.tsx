import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LocationState } from '../types/LocationState';

interface AuthContextType {
  token: string;
  userId: string;
  login: (token: string, userId: string, callback: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [token, setToken] = React.useState<string>('');
  const [userId, setUserId] = React.useState<string>('');

  const login = (
    newToken: string,
    newUserId: string,
    callback: VoidFunction,
  ) => {
    setToken(newToken);
    setUserId(newUserId);
    callback();
  };

  const logout = (callback: VoidFunction) => {
    setToken('');
    setUserId('');
    callback();
  };

  const value = { token, userId, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext);
}

export const RequireAuth = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();

  const locationState: LocationState = { from: location };

  if (!auth.token) {
    return <Navigate to="/auth" state={locationState} replace />;
  }

  return children;
};
