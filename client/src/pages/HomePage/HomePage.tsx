

import HomeMap from "../HomePage/HomeMap";
import "../../styles/HomePage.css"; // Import custom styles if needed
import '../../styles/Footer.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../../styles/HomePage.css"; // Import custom styles
import WhereToPage from "../WhereToPage"; // Import WhereToPage component


const HomePage: React.FC = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State to toggle search drawer
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setIsSearchExpanded(true); // Expand the search drawer when clicked
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false); // Close the search drawer
  };

  return (
    <div className="home-page">
      {/* Map Section */}
      <div className="Home-map-container">
        <HomeMap />
      </div>

      {/* Search Bar Section (under the map) */}
      {!isSearchExpanded && (
        <div className="search-section">
          <div className="search-bar" onClick={handleSearchClick}>
            <input type="text" placeholder="Where to?" readOnly />
            <button className="microphone-icon">🎤</button>
          </div>
        </div>
      )}

      {/* Expandable Search Drawer */}
      {isSearchExpanded && (
        <div className="full-page-overlay">
          {/* WhereToPage Content */}
          <div className="expanded-search">
            <button className="back-button" onClick={handleCloseSearch}>
              ⬅ Back
            </button>
            <WhereToPage />
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer-bar">
        {/* Navigation Icons */}
        <button className="footer-icon" onClick={() => navigate("/")}>
          🏠 {/* Home Icon */}
        </button>
        <button className="footer-icon" onClick={() => navigate("/visualisations")}>
          📊 {/* Analytics Icon */}
        </button>
        <button className="footer-icon" onClick={() => navigate("/profile")}>
          👤 {/* Profile Icon */}
        </button>
      </footer>
    </div>

  );
};

export default HomePage;