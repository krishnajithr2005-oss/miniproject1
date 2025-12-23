import React from "react";

const Signup = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" /><br /><br />
      <input type="password" placeholder="Password" /><br /><br />
      <button>Register</button>
    </div>
  );
};

export default Signup;
