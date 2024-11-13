import React from 'react';
import { Link } from 'react-router-dom';
import './NoMatch.css';

const NoMatch = () => {
  return (
    <div className="nomatch-container">
      <div className="nomatch-content">
        <h1 className="nomatch-title">Not Found</h1>
        <div className="nomatch-animation">
          <div className="tic-tac-toe-board">
            <div className="cell" id="cell-1"></div>
            <div className="cell" id="cell-2"></div>
            <div className="cell" id="cell-3"></div>
            <div className="cell" id="cell-4"></div>
            <div className="cell" id="cell-5"></div>
            <div className="cell" id="cell-6"></div>
            <div className="cell" id="cell-7"></div>
            <div className="cell" id="cell-8"></div>
            <div className="cell" id="cell-9"></div>
          </div>

        </div>
      </div>
      <p className="nomatch-message">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="nomatch-home-link">Go Back Home</Link>

    </div>
  );
};

export default NoMatch;