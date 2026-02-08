import React from "react";
import "./SOSButton.css";

const SOSButton = ({ onClick, disabled = false }) => {
  return (
    <button
      className="sos-floating-btn"
      onClick={onClick}
      disabled={disabled}
      title="Emergency SOS Alert"
      aria-label="Emergency SOS Alert"
    >
      <span className="sos-icon">🆘</span>
      <span className="sos-text">SOS</span>
      <span className="pulse"></span>
    </button>
  );
};

export default SOSButton;