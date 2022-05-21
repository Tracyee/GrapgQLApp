import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './app.less';
import MainNavigation from './components/navigation/mainNavigation';
import AuthPage from './pages/auth';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';
import AuthContext from './contexts/authContext';

const App: React.FC<Record<string, never>> = () => {
  const [token, setToken] = React.useState<string>('');
  const [userId, setUserId] = React.useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const login = (token: string, userId: string, tokenExpiration: number) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken('');
    setUserId('');
  };

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            token,
            userId,
            login,
            logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={token ? <EventsPage /> : <AuthPage />} />
              {!token && <Route path="/auth" element={<AuthPage />} />}
              <Route path="/events" element={<EventsPage />} />
              {token && <Route path="/bookings" element={<BookingsPage />} />}
            </Routes>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
};

export default App;
