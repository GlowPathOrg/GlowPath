import { useEffect, useState } from "react";
import SettingsComponent from "./SettingsComponent";
import { useLoginStatus } from "../../hooks/userLogin";
import RegisterComponent from "./RegisterComponent";
import HelpComponent from "./HelpComponent";
import ContactsComponent from "./ContactsComponent";
import "../../styles/profilePage.css";
import "../../styles/Footer.css";
import LoginComponent from "./LoginComponent";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [viewOption, setViewOption] = useState("");
  const { isAuthorized, userData } = useLoginStatus();

  useEffect(() => {
    if (isAuthorized === true && userData) {
      setViewOption("settings");
    }
  }, [isAuthorized, userData]);

  const handleLogout = () => {
    setViewOption("login");
  };

  return (
    <div className="profile-page">
      <div className="menu-panel">
        <button className="menu-button" onClick={() => setViewOption("settings")}>Settings</button>
        <button className="menu-button" onClick={() => setViewOption("contacts")}>Contacts</button>
        <button className="menu-button" onClick={() => setViewOption("help")}>Help</button>
        <button className="menu-button" onClick={() => handleLogout()}>Log Out</button>
      </div>

      <div className="main-content">
        <h2>Welcome, {userData?.firstName}!</h2>

        <div className="container">
          {viewOption === "settings" &&  <SettingsComponent />}
          {viewOption === "" && <RegisterComponent setViewOption={setViewOption} />}
          {viewOption === "login" && <LoginComponent setViewOption={setViewOption} />}
          {viewOption === "contacts" && <ContactsComponent />}
          {viewOption === "help" && <HelpComponent />}
        </div>
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
    </div>
  );
};

export default ProfilePage;
