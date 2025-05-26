import React, { useState, useEffect } from "react";
import "../../styles/SettingsPage.css";
import { useUser } from "../../hooks/useUser";
import { SettingsI } from "../../Types/User";


const SettingsPage: React.FC = () => {
/*   const defaultSettings: SettingsI = {
    notifyNearby: true,
    notifyAuthorities: true,
    allowNotifications: true,
    defaultSos: "Please contact me, I might be in danger.",
    theme: "dark"
  }; */
  const { user, updateUser } = useUser();
  const settings: SettingsI | undefined = user?.settings;
  console.log(`settingg is ${settings}`)

  const [uiNotifyNearby, setUiNotifyNearby] = useState(true);
  const [uiNotifyAuthorities, setUiNotifyAuthorities] = useState(true);
  const [uiAllowNotifications, setUiAllowNotifications] = useState(true);
  const [uiSosMessage, setUiSosMessage] = useState(user?.settings?.defaultSos || "Help me, I am in danger!");
  const [uiTheme, setUiTheme] = useState<string>("dark");

  // Load settings from hook
  useEffect(() => {
if (settings) {
  setUiNotifyNearby(settings.notifyNearby);
  setUiNotifyAuthorities(settings.notifyAuthorities);
  setUiAllowNotifications(settings.allowNotifications);
  setUiSosMessage(settings.defaultSos);
  setUiTheme(settings.theme || "dark");
}
  }, [settings]);

  // Apply theme to document body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", uiTheme);
  }, [uiTheme]);

  const toggleTheme = () => {
    setUiTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSave = async () => {
    const newSettings: SettingsI = {
      notifyNearby: uiNotifyNearby,
      notifyAuthorities: uiNotifyAuthorities,
      allowNotifications: uiAllowNotifications,
      defaultSos: uiSosMessage,
      theme: uiTheme,
    };

    await updateUser({settings: newSettings});
    alert("Settings saved!");
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <section>
        <h2>SOS Button Options</h2>
        <label>
          <input
            type="checkbox"
            checked={uiNotifyNearby}
            onChange={() => setUiNotifyNearby(!uiNotifyNearby)}
          />
          Notify Users Nearby
        </label>
        <label>
          <input
            type="checkbox"
            checked={uiNotifyAuthorities}
            onChange={() => setUiNotifyAuthorities(!uiNotifyAuthorities)}
          />
          Notify Authorities
        </label>
        <label>
          <input
            type="checkbox"
            checked={uiAllowNotifications}
            onChange={() => setUiAllowNotifications(!uiAllowNotifications)}
          />
          Allow SOS notifications from other users
        </label>
      </section>

      <section>
        <h2>Default SOS Message</h2>
        <textarea
          value={uiSosMessage}
          onChange={(e) => setUiSosMessage(e.target.value)}
          placeholder="Enter your SOS message here"
        />
      </section>

      <section>
        <h2>Theme</h2>
        <button className="theme-toggle-button" onClick={toggleTheme}>
          Switch to {uiTheme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </section>

      <button className="save-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
