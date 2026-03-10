import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const isValidGmail = (emailValue) => {
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    return gmailRegex.test(emailValue);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validation checks
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!isValidGmail(email)) {
      setError("Please enter a valid Gmail address (example@gmail.com)");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // If all validations pass, proceed to login
    localStorage.setItem(
      "user",
      JSON.stringify({ email })
    );
    navigate("/home");
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        <h1 className="title">NATURAL DISASTER</h1>
        <h2 className="subtitle">RISK ANALYZER</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email (example@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>

        <div className="login-links">
          <span onClick={() => navigate("/signup")}>Sign Up</span>
          <span onClick={() => navigate("/forgot")}>Forgot Password?</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
