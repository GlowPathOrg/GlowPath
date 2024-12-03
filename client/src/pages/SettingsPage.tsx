import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SettingsPage.css";
import SosButton from "../pages/journeyPage/SosButton"

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

  // State for theme (light or dark)
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  // Apply theme dynamically by toggling a CSS class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Handle toggling of SOS options
  const handleToggle = (option: keyof typeof sosSettings) => {
    setSosSettings((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // Handle SOS Button functionality
  const handleSosClick = async () => {
    if (sosSettings.notifyContacts && sosSettings.emergencyContacts.length > 0) {
      try {
        // Send real API request
        const response = await fetch("http://localhost:3002/notify-contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contacts: sosSettings.emergencyContacts,
            message: sosMessage,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send SMS notifications.");
        }

        const result = await response.json();
        alert(`SOS successfully sent to: ${sosSettings.emergencyContacts.join(", ")}`);
        console.log("API Response:", result);
      } catch (error) {
        console.error("Error sending SOS message:", error);
        alert("Failed to send SOS message. Please try again.");
      }
    } else if (sosSettings.notifyContacts) {
      alert("No emergency contacts found!");
    }

    if (sosSettings.notifyNearbyUsers) {
      await notifyNearbyUsers();
    }

    if (sosSettings.callAuthorities) {
      callAuthorities();
    }
  };

  // Notify nearby users (Mock for now)
  const notifyNearbyUsers = async () => {
    console.log("Notifying nearby SafeWalk users...");
    alert("Notification sent to nearby users.");
    return Promise.resolve();
  };

  // Call local authorities
  const callAuthorities = () => {
    console.log("Calling local authorities...");
    alert("Calling emergency services...");
    window.open("tel:112"); // Replace with the appropriate emergency number
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
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
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
      <section>
        <h2>Appearance</h2>
        <button className="theme-toggle-button" onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </section>

      {/* Real SOS Test Button */}
      <section>
        <h2>Test SOS Button</h2>
       <SosButton/>
      </section>

      <button className="save-button" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;