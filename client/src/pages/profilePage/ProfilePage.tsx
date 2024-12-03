import { useEffect, useState } from "react";
import SettingsComponent from "./SettingsComp";
import { useLoginStatus } from "../../hooks/userLogin";
import RegisterComponent from "./RegisterComponent";
import "../../styles/profilePage.css";
import "../../styles/Footer.css";
import LoginComponent from "./LoginComponent";
import { Link } from "react-router-dom";
import InfoComponent from "./InfoComponent";
import ContactsComponent from "./ContactsComp";

const ProfilePage = () => {
  const [viewOption, setViewOption] = useState("");
  const { isAuthorized, userData } = useLoginStatus();

  useEffect(() => {
    if (isAuthorized === true && userData) {
      setViewOption("info");
    }
  }, [isAuthorized, userData]);

  const handleLogout = () => {
    setViewOption("login");
  };

  return (
    <div className="profile-page">
      <div className="menu-panel">
        <button className="menu-button" onClick={() => setViewOption("settings")}>Settings</button>
        <button className="menu-button" onClick={() => setViewOption("info")}>My Information</button>
        <button className="menu-button" onClick={() => setViewOption("contacts")}>My Contacts</button>
        <button className="menu-button" onClick={() => handleLogout()}>Log Out</button>
      </div>

      <div className="main-content">
        <h2>Welcome, {userData?.firstName}!</h2>

        <div className="container">
          {viewOption === "settings" &&  <SettingsComponent />}
          {viewOption === "info" &&  <InfoComponent />}
          {viewOption === "contacts" &&  <ContactsComponent />}
          {viewOption === "" && <RegisterComponent setViewOption={setViewOption} />}
          {viewOption === "login" && <LoginComponent setViewOption={setViewOption} />}

        </div>
        <footer className="footer-bar">
          <Link to="/" className="footer-icon">
            🏠
          </Link>


          <Link to="/analytics" className="footer-icon">
            🕒
          </Link>


          <Link to="/profile" className="footer-icon">
            👤
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
