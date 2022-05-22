import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';

import './app.less';
import MainNavigation from './components/navigation/mainNavigation';
import AuthPage from './pages/auth';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';
import { AuthProvider, useAuth } from './contexts/authContext';
import { LocationState } from './types/LocationState';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  const locationState: LocationState = { from: location };

  if (!auth.token) {
    return <Navigate to="/auth" state={locationState} replace />;
  }

  return children;
};

const App: React.FC<Record<string, never>> = () => (
  <Router>
    <AuthProvider>
      <MainNavigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/bookings"
            element={
              <RequireAuth>
                <BookingsPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  </Router>
);

export default App;
