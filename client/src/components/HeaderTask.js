import React from 'react';
import PropTypes from 'prop-types';
import './App_comp.css';

function HeaderTask({ HandleLogoff, setCurrTab }) {
  const handleLogoff = () => {
    HandleLogoff();
  };

  const handleContactUs = () => {
    setCurrTab(3); // Assuming 3 is the tab index for the Contact Us page
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
              className="nav-item nav-link nav-button"
              style={{ cursor: 'pointer' }}
              onClick={handleContactUs}
            >
              Contact Us
            </button>
            <button
              className="nav-item nav-link nav-button"
              style={{ cursor: 'pointer' }}
              onClick={handleLogoff}
            >
              Log Off
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

HeaderTask.propTypes = {
  HandleLogoff: PropTypes.func.isRequired,
  setCurrTab: PropTypes.func.isRequired,
};

export default HeaderTask;
