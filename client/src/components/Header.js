import React from 'react';
import PropTypes from 'prop-types';
import './App_comp.css';

function Header({ curr_tab, setCurr_tab }) {
  const handleTabSignUp = () => {
    setCurr_tab(2);
  };

  const handleTabLogIn = () => {
    setCurr_tab(1);
  };

  const handleTabContactUs = () => {
    setCurr_tab(3); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark text-uppercase" id="mainNav">
      <div className="container">
        <span className="navbar-brand">Crypto Information</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <button
              className={`nav-item nav-link nav-button ${curr_tab === 1 ? 'border border-white rounded' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleTabLogIn}
            >
              Log In {curr_tab === 1 && <span className="sr-only">(current)</span>}
            </button>
            <button
              className={`nav-item nav-link nav-button ${curr_tab === 2 ? 'border border-white rounded' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleTabSignUp}
            >
              Sign Up {curr_tab === 2 && <span className="sr-only">(current)</span>}
            </button>
            <button
              className={`nav-item nav-link nav-button ${curr_tab === 3 ? 'border border-white rounded' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleTabContactUs}
            >
              Contact Us {curr_tab === 3 && <span className="sr-only">(current)</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Header.propTypes = {
  curr_tab: PropTypes.number.isRequired,
  setCurr_tab: PropTypes.func.isRequired,
};

export default Header;
