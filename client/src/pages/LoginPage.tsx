import React, { useState } from "react";
import { login, profile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";




const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
const navigate = useNavigate();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    try {
   const response = await login(formData);
      if (response.token) {
        setMessage("Login successful!")
        setTimeout(()=>3);
        try {
         await profile();
          navigate('/me');
        }
        catch (error) {
          console.log('error loading profile', error);
          throw error;
        }

      } else {
        setErrorMessage("Please check your credentials.");
      }



    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          Log In
        </button>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
