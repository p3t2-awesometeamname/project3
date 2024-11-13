import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth';
import './Nav.css';

function Nav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className={`nav-items ${isOpen ? 'open' : ''}`}>
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/Profile' ? 'active' : ''}`}>
            <Link to="/Profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          </li>
          <li className="nav-item">
            <a href="/" onClick={() => { Auth.logout(); setIsOpen(false); }}>Logout</a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className={`nav-items ${isOpen ? 'open' : ''}`}>
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/signup' ? 'active' : ''}`}>
            <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
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
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="nav-menu"
        >
          <span className="hamburger-box">
            <span className={`hamburger-inner ${isOpen ? 'open' : ''}`}></span>
          </span>
        </button>
        {showNavigation()}
      </nav>
    </header>
  );
}

export default Nav;