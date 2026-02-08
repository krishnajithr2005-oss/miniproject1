import React, { useState, useEffect } from "react";
import "./SOSModal.css";

const SOSModal = ({ isOpen, onClose, selectedPlace, placeData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setShowToast(true);

    // Auto-close modal and toast after 3 seconds
    setTimeout(() => {
      handleClose();
      setIsConfirmed(false);
      setShowToast(false);
    }, 3000);
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on backdrop, not on modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get location data from placeData or use fallback
  const lat = placeData?.coordinates?.lat || 11.4279;
  const lng = placeData?.coordinates?.lng || 76.7642;
  const location = selectedPlace || "Thiruvananthapuram District, Kerala";

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="sos-backdrop" onClick={handleBackdropClick}></div>

      {/* MODAL */}
      <div className={`sos-modal ${isConfirmed ? "confirmed" : ""}`}>
        {/* CLOSE BUTTON */}
        <button
          className="sos-close-btn"
          onClick={handleClose}
          aria-label="Close SOS Modal"
          title="Close (ESC)"
        >
          ✕
        </button>

        {!isConfirmed ? (
          <>
            {/* HEADER */}
            <div className="sos-header">
              <div className="siren-icon">🆘</div>
              <h2>Emergency SOS Activated</h2>
              <p className="sos-subtitle">
                Your emergency alert has been sent to authorities
              </p>
            </div>

            {/* CONTENT */}
            <div className="sos-content">
              {/* AUTHORITIES NOTIFIED */}
              <div className="authorities-section">
                <h3>Authorities Notified:</h3>
                <div className="authority-list">
                  <div className="authority-item">
                    <span className="checkmark">✓</span>
                    <span className="authority-name">
                      State Disaster Management Authority (SDMA)
                    </span>
                  </div>
                  <div className="authority-item">
                    <span className="checkmark">✓</span>
                    <span className="authority-name">
                      Local Police Station
                    </span>
                  </div>
                  <div className="authority-item">
                    <span className="checkmark">✓</span>
                    <span className="authority-name">
                      Nearest Relief & Camp Operations
                    </span>
                  </div>
                  <div className="authority-item">
                    <span className="checkmark">✓</span>
                    <span className="authority-name">
                      Emergency Response Team
                    </span>
                  </div>
                </div>
              </div>

              {/* AUTO-DETECTED LOCATION */}
              <div className="location-section">
                <h3>📍 Auto-Detected Location</h3>
                <div className="location-card">
                  <div className="location-item">
                    <span className="label">Latitude:</span>
                    <span className="value">{lat.toFixed(4)}° N</span>
                  </div>
                  <div className="location-item">
                    <span className="label">Longitude:</span>
                    <span className="value">{lng.toFixed(4)}° E</span>
                  </div>
                  <div className="location-item full-width">
                    <span className="label">Address:</span>
                    <span className="value">{location}, Kerala</span>
                  </div>
                </div>
              </div>

              {/* HELPLINE NUMBERS */}
              <div className="helpline-section">
                <h3>📞 Emergency Helplines</h3>
                <div className="helpline-numbers">
                  {placeData?.resources?.helplines?.map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num}`}
                      className="helpline-number"
                      title={`Call ${num}`}
                    >
                      <span className="phone-icon">📱</span>
                      <span className="number">{num}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              <div className="success-message">
                <span className="icon">ℹ️</span>
                <p>
                  Help is on the way! Stay calm and move to higher ground if
                  possible. Emergency services have been notified and will reach
                  you shortly.
                </p>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="sos-footer">
              <button className="btn-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleConfirm}>
                Confirm Emergency Status
              </button>
            </div>
          </>
        ) : (
          /* CONFIRMED STATE */
          <div className="sos-confirmed">
            <div className="success-icon">✅</div>
            <h2>Emergency Confirmed</h2>
            <p className="confirmed-message">
              All authorities have been notified and are responding to your
              location.
            </p>
            <p className="location-confirmation">
              📍 {location}, Kerala
            </p>
          </div>
        )}
      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="toast-notification">
          <span className="toast-icon">✓</span>
          <span className="toast-message">
            Emergency confirmed - Help is on the way!
          </span>
        </div>
      )}
    </>
  );
};

export default SOSModal;