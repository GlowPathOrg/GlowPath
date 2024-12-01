import React, { FormEvent, useState } from "react";
import { register } from "../../services/authService";
import '../../styles/RegisterComponent.css';
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input/input";
import { useLoginStatus } from "../../hooks/userLogin";



interface RegisterComponentProps {
  setViewOption: (view: string) => void;
}


const RegisterComponent: React.FC<RegisterComponentProps>
 = ({setViewOption}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    telephone: "",

  });
  const [message, setMessage] = useState("");
  const [value, setValue] = useState<string | undefined>();
  const {handleLogin} = useLoginStatus();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    setValue(value); // Update the phone input value
    setFormData({ ...formData, telephone: value || "" });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
      const password = formData.password;
  if (password.length < 8) {
    alert('Password must be at least 8 characters long');
    return;
  }
    try {
      await register(formData, handleLogin);
      setMessage("Registration successful!");
      setTimeout(() => 1);
      setViewOption('settings')
    } catch (error) {
      setMessage("Error registering. Please try again. " + error);
    }
  };

  return (
   <>

      <div className="register-page">
        <button onClick={() => setViewOption('login')}>Go to log in</button>
        <form onSubmit={handleSubmit} className="register-form">
          <h1>Register for GlowPath:</h1>
          <div className="form-group">
            <label htmlFor="first-name">First name (required)</label>
            <input
              id="first-name"
              type="text"
              name="firstName"
              onChange={handleChange}
              required
            />
            <label htmlFor="last-name">Last name (required)</label>
            <input
              id="last-name"
              type="text"
              name="lastName"
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email address (required)</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Telephone (optional)</label>
            <PhoneInput
              placeholder="Enter phone number"
              value={value?.toString()}
              onChange={handlePhoneChange}
             />
          </div>
          <div className="form-group">
            <label htmlFor="password">Enter a valid password. Passwords must be at least 8 characters long.</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>

          {message && <p className="message">{message}</p>}
        </form>

      </div>
   </>
  );
};

export default RegisterComponent
;