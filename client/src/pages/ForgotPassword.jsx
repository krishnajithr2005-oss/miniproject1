import React from "react";

const ForgotPassword = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter email" /><br /><br />
      <button>Reset</button>
    </div>
  );
};

export default ForgotPassword;
