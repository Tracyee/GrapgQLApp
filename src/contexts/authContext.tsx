import React from 'react';

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
