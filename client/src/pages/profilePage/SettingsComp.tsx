import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SettingsPage.css"

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // State for SOS settings
  const [sosSettings, setSosSettings] = useState({
    notifyContacts: true,
    notifyNearbyUsers: true,
    callAuthorities: true,
    emergencyContacts: [] as string[], // List of emergency contacts
  });

  // State for default SOS message
  const [sosMessage, setSosMessage] = useState<string>("Help me, I am in danger!");

  

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    if (savedSettings) {
      setSosSettings((prev) => ({ ...prev, ...savedSettings }));
      setSosMessage(savedSettings.sosMessage || "Help me, I am in danger!");
      setTheme(savedSettings.theme || "light");
      document.documentElement.setAttribute("data-theme", savedSettings.theme || "light");
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settingsToSave = { ...sosSettings, theme, sosMessage };
    localStorage.setItem("settings", JSON.stringify(settingsToSave));
    alert("Settings saved successfully!");
  };

  

  // Handle toggling of SOS options
  const handleToggle = (option: keyof typeof sosSettings) => {
    setSosSettings((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      {/* SOS Options */}
      <section>
        <h2>SOS Button Options</h2>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sosSettings.notifyContacts}
              onChange={() => handleToggle("notifyContacts")}
            />
            Notify Emergency Contacts
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sosSettings.notifyNearbyUsers}
              onChange={() => handleToggle("notifyNearbyUsers")}
            />
            Notify Nearby Users
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sosSettings.callAuthorities}
              onChange={() => handleToggle("callAuthorities")}
            />
            Call Local Authorities
          </label>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section>
        <h2>Emergency Contacts</h2>
        <button
          onClick={() => navigate("/contact-manager")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2f2f2f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          className="emergency"
        >
          Manage Contacts
        </button>
        <ul>
          {sosSettings.emergencyContacts.map((contact, idx) => (
            <li key={idx}>{contact}</li>
          ))}
        </ul>
      </section>

      {/* Default SOS Message */}
      <section>
        <h2>Default SOS Message</h2>
        <textarea
          value={sosMessage}
          onChange={(e) => setSosMessage(e.target.value)}
          placeholder="Enter your SOS message here"
          style={{
            width: "100%",
            height: "80px",
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </section>

      {/* Appearance Section */}
      
      <button className="save-button" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;