import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://civic-backend-6wpl.onrender.com/api/users/register", {
        name,
        phone,
        password,
        ward,
      });

      alert("Registration successful ✅");
      navigate("/");

    } catch (error) {
  console.log("FULL ERROR:", error.response);
  alert(error.response?.data?.message || error.message);
}
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Ward"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;