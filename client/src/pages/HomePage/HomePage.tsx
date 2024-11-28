import React from "react";
import HomeMap from "../HomePage/HomeMap";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../styles/HomePage.css"; // Import custom styles if needed

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>

      {/* Map Section */}

      <HomeMap/>

      {/* Navigation Section */}
      <div className="navigation-section">
      <Link to="/where-to">
        <button className="navigation-button">Where to</button>
      </Link>
      <Link to="/history">
        <button className="navigation-button">History</button>
      </Link>
      </div>

      {/* Footer Section */}
      <footer className="footer-bar">
        {/* Home Button */}
        <Link to="/" className="footer-icon">
          🏠 {/* Home Icon */}
        </Link>

        {/* History Button */}
        <Link to="/analytics" className="footer-icon">
          🕒 {/* History Icon */}
        </Link>

        {/* Profile Button */}
        <Link to="/profile" className="footer-icon">
          👤 {/* Profile Icon */}
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
