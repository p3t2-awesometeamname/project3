import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth';
import './Nav.css';

function Nav() {
  const location = useLocation();

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="nav-items">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/">Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/Profile' ? 'active' : ''}`}>
            <Link to="/Profile">Profile</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about">About</Link>
          </li>
          <li className="nav-item">
            <a href="/" onClick={() => Auth.logout()}>Logout</a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="nav-items">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/">Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about">About</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/signup' ? 'active' : ''}`}>
            <Link to="/signup">Signup</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <header className="nav-header">
      <h1 className="nav-logo">
        <Link to="/">PlayWise</Link>
      </h1>
      <nav>
        {showNavigation()}
      </nav>
    </header>
  );
}

export default Nav;