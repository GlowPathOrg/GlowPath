import React, { useContext, useState } from "react";
import { loginService } from "../../services/authService";
import "../../styles/RegisterComponent.css"; // Reuse the same styles
import { AuthContext } from "../../contexts/UserContext";

interface LoginComponentProps {
  setViewOption: (view: string) => void;
}

const LoginPage: React.FC<LoginComponentProps> = ({ setViewOption }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {handleLoginContext} = useContext(AuthContext)


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    try {
      const response = await loginService(formData);
      if (response.data.token && response.data.user) {
        handleLoginContext(response.data.token, response.data.user)
        setMessage("Login successful!");
        setTimeout(() => 1);
        setViewOption("settings");
      } else {
        setErrorMessage("Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <button className="go-to-register-btn" onClick={() => setViewOption("")}>Go to Register</button>
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Login to GlowPath:</h1>
        <div className="form-group">
          <label htmlFor="email">Email address:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Log In
        </button>
        {message && <p className="message success">{message}</p>}
        {errorMessage && <p className="message error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;