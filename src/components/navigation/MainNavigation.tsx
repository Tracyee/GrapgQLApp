import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import './mainNavigation.less';

const MainNavigation = (): JSX.Element => {
  const auth = useAuth();
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
          {auth.token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => auth.logout(() => navigate('/'))}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
