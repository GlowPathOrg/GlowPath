import { useContext, useEffect, useState } from "react";
import SettingsComponent from "./SettingsComp";
import { AuthContext } from "../../contexts/UserContext";
import RegisterComponent from "./RegisterComponent";
import "../../styles/profilePage.css";
import "../../styles/Footer.css";
import LoginComponent from "./LoginComponent";
import Footer from "../../components/Footer"
import InfoComponent from "./InfoComponent";

const ProfilePage = () => {
  const [viewOption, setViewOption] = useState("");
  const { isAuthorized, user, setUser, handleLogoutContext } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthorized === true && user) {
      setViewOption("settings");

    }
  }, [isAuthorized, user, setUser]);

  const logout = () => {
    handleLogoutContext();
    setViewOption("login");
  };

  return (
    <div className="profile-page">
      <div className="menu-panel">
        <button className="menu-button" onClick={() => setViewOption("settings")}>Settings</button>
        <button className="menu-button" onClick={() => setViewOption("info")}>My Information</button>
       {/*  <button className="menu-button" onClick={() => setViewOption("contacts")}>Contacts</button>
        <button className="menu-button" onClick={() => setViewOption("help")}>Help</button>
        */} <button className="menu-button" onClick={() => logout()}>Log Out</button>
      </div>

      <div className="main-content">
        <h2>Welcome, {user?.firstName}!</h2>

        <div className="container">
          {viewOption === "settings" &&  <SettingsComponent />}
          {viewOption === "info" &&  <InfoComponent />}
          {viewOption === "" && <RegisterComponent setViewOption={setViewOption} />}
          {viewOption === "login" && <LoginComponent setViewOption={setViewOption} />}
        </div>
       <Footer/>
      </div>
    </div>
  );
};

export default ProfilePage;
