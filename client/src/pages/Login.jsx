import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      localStorage.setItem(
        "user",
        JSON.stringify({ username })
      );
      navigate("/home");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        <h1 className="title">NATURAL DISASTER</h1>
        <h2 className="subtitle">RISK ANALYZER</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
