import React, { FormEvent, useState } from "react";
import { register } from "../services/authService";
import Navbar from "../components/Navbar";
import '../styles/RegisterPage.css'


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "traveller",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
      const password = formData.password;
  if (password.length < 8) {
    alert('Password must be at least 8 characters long');
    return;
  }
    try {
      await register(formData);
      setMessage("Registration successful!");




    } catch (error) {
      setMessage("Error registering. Please try again:" + error);
    }
  };

  return (
   <>
   <Navbar/>
      <div className="register-page">
        <form onSubmit={handleSubmit} className="register-form">
          <h1>Register for GlowPath:</h1>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email (required)"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <select name="role" onSelect={handleSelect} required>
              <option value="adopter">Traveller</option>
              <option value="shelter">Observer</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
   </>
  );
};

export default RegisterPage;
