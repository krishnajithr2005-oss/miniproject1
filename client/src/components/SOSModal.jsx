import React, { useState, useEffect } from "react";
import "./SOSModal.css";

const SOSModal = ({ isOpen, onClose, selectedPlace, placeData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedHelpline, setSelectedHelpline] = useState(null);

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
    // Send SOS to server which will use DB alerts or fallback to placeData
    (async () => {
      try {
        const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";
        const resp = await fetch(`${API_BASE}/api/sos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place: selectedPlace, phone: selectedHelpline || "8078518247", placeData }),
        });
        if (!resp.ok) {
          const errText = await resp.text().catch(() => "");
          throw new Error(`Server responded ${resp.status}: ${errText}`);
        }

        const result = await resp.json();
        // show confirmation UI and toast
        setIsConfirmed(true);
        setShowToast(true);

        // optionally show server message in console for debugging
        console.log("SOS result:", result);

        // Auto-close modal and toast after 3 seconds
        setTimeout(() => {
          handleClose();
          setIsConfirmed(false);
          setShowToast(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to send SOS:", err);
        alert("Failed to send SOS. Please try again or call emergency helpline.");
      }
    })();
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

  // initialize selected helpline when placeData changes
  useEffect(() => {
    const first = placeData?.resources?.helplines?.[0];
    setSelectedHelpline(first || "8078518247");
  }, [placeData]);

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
                  {placeData?.resources?.helplines && placeData.resources.helplines.length > 0 ? (
                    placeData.resources.helplines.map((num, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`helpline-number ${selectedHelpline === num ? "selected" : ""}`}
                        onClick={() => setSelectedHelpline(num)}
                        title={`Send SOS to ${num}`}
                      >
                        <span className="phone-icon">📱</span>
                        <span className="number">{num}</span>
                      </button>
                    ))
                  ) : (
                    <p className="placeholder-text">No helplines available</p>
                  )}
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