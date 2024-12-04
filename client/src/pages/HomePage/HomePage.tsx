import HomeMap from "../HomePage/HomeMap";
import "../../styles/HomePage.css"; // Custom styles
import Footer from "../../components/Footer"
import { useState } from "react";
import "../../styles/HomePage.css"; // Custom styles
import WhereToPage from "../WhereToPage"; // WhereToPage component
import SosButton from "../../pages/journeyPage/SosButton";
const HomePage: React.FC = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // Toggle state for the search drawer
 

  const handleSearchClick = () => {
    setIsSearchExpanded(true); // Expand the search drawer
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false); // Close the search drawer
  };

  return (
    <div className="main">
      {/* Map Section */}
      <div className="Home-map-container">
        <HomeMap />
        
      </div>

      {/* Search Bar Section */}
      {!isSearchExpanded && (
        <div className="tray">
          <div className="search-bar" onClick={handleSearchClick}>
          <img
        src="https://img.icons8.com/?size=100&id=AXAzyxeWycrs&format=png&color=F25081"
        alt="Search Icon"
        className="search-icon"></img>
            <input
              type="text"
              className="searchbox"
              placeholder="Search here"
              readOnly
            />
           <img src="/search.svg" alt="Search Icon" className="button-icon" />
          </div>
        </div>
      )}

      {/* Expandable Search Drawer */}
      {isSearchExpanded && (
        <div className="tray">
          <div className="expanded-search">
            <button className="back-button" onClick={handleCloseSearch}>
              <img src="https://img.icons8.com/?size=100&id=3e5DEX0jAFhN&format=png&color=FFFFFF"  alt="Search Icon"
        className="search-icon">
             
       </img>
            </button>
            <WhereToPage />
          </div>
        </div>
      )}

     <Footer/>
    </div>
  );
};

export default HomePage;