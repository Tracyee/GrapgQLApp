import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { LocationState } from '../../types/LocationState';
import './mainNavigation.less';

const MainNavigation = (): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();
  const locationState: LocationState = { from: location };

  const navigate = useNavigate();

  return (
    <header className="main-navigation">
      <div className="main-navigation-logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation-items">
        <ul>
          {!auth.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
          {auth.token && (
            <li>
              <button
                type="button"
                onClick={() =>
                  auth.logout(() =>
                    navigate('/', { state: locationState, replace: true }),
                  )
                }
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
