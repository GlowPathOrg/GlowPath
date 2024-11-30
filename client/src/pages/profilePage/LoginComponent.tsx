import React, { useState } from "react";
import { login } from "../../services/authService";
import { useLoginStatus } from "../../hooks/userLogin";

interface LoginComponentProps {
  setViewOption: (view: string) => void;
}


const LoginPage: React.FC<LoginComponentProps> = ({setViewOption}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { handleLogin } = useLoginStatus();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    try {
   const response = await login(formData, handleLogin);
      if (response.data.token) {
        setMessage("Login successful!")
        setTimeout(()=>1);
        setViewOption('settings')


      } else {
        setErrorMessage("Please check your credentials.");
      }



    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <button onClick={() => setViewOption('')}>Sign up</button>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <h1>Login</h1>
    <label htmlFor="email">Enter email: </label>
          <input
          id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Enter password: </label>
          <input
          id="password"
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
