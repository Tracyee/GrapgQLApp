import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './app.less';
import MainNavigation from './components/navigation/MainNavigation';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

const App: React.FC<Record<string, never>> = () => (
  <BrowserRouter>
    <>
      <MainNavigation />
      <main className="main-content">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </>
  </BrowserRouter>
);

export default App;
