import React, { useState, useEffect } from 'react';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  // State for SOS settings
  const [sosSettings, setSosSettings] = useState({
    notifyContacts: true,
    notifyNearbyUsers: true,
    callAuthorities: true,
    emergencyContacts: [] as string[], // List of emergency contacts
  });

  // State for theme (light or dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings') || '{}');
    if (savedSettings) {
      setSosSettings((prev) => ({ ...prev, ...savedSettings }));
      setTheme(savedSettings.theme || 'light');
      document.documentElement.setAttribute('data-theme', savedSettings.theme || 'light');
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settingsToSave = { ...sosSettings, theme };
    localStorage.setItem('settings', JSON.stringify(settingsToSave));
    alert('Settings saved successfully!');
  };

  // Apply theme dynamically by toggling a CSS class
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); // Update the theme attribute in <html>
  };

  // Handle SOS button click
  const handleSosClick = () => {
    if (sosSettings.notifyContacts && sosSettings.emergencyContacts.length > 0) {
      alert(`Sending SOS to: ${sosSettings.emergencyContacts.join(', ')}`);
      // Implement API or SMS logic here
    } else if (sosSettings.notifyContacts) {
      alert('No emergency contacts found!');
    }
    if (sosSettings.notifyNearbyUsers) {
      alert('Notifying nearby SafeWalk users...');
      // Implement real-time notification logic here
    }
    if (sosSettings.callAuthorities) {
      alert('Calling local authorities...');
      window.open('tel:112'); // Example emergency number
    }

  };

  // Handle toggling of SOS options
  const handleToggle = (option: keyof typeof sosSettings) => {
    setSosSettings((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // Add new emergency contact
  const addEmergencyContact = (contact: string) => {
    setSosSettings((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact],
    }));
  };

  // Remove emergency contact
  const removeEmergencyContact = (index: number) => {
    setSosSettings((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
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
              onChange={() => handleToggle('notifyContacts')}
            />
            Notify Emergency Contacts
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sosSettings.notifyNearbyUsers}
              onChange={() => handleToggle('notifyNearbyUsers')}
            />
            Notify Nearby Users
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sosSettings.callAuthorities}
              onChange={() => handleToggle('callAuthorities')}
            />
            Call Local Authorities
          </label>
        </div>

      </section>

      {/* Emergency Contacts */}
      <section>
        <h2>Emergency Contacts</h2>
        <input
          type="text"
          placeholder="Add contact (email or phone)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              addEmergencyContact(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <ul>
          {sosSettings.emergencyContacts.map((contact, idx) => (
            <li key={idx}>
              {contact}{' '}
              <button onClick={() => removeEmergencyContact(idx)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Appearance Section */}
      <section>
        <h2>Appearance</h2>
        <button className="theme-toggle-button" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </section>

      {/* Alerts Section */}
      <section>
        <h2>Alerts</h2>
        <p className="alerts">Manage the app alerts.</p>
      </section>

      {/* Test SOS Button */}
      <section>
        <h2>Test SOS Button</h2>
        <button className="sos-button" onClick={handleSosClick}>
          SOS
        </button>
      </section>

      <button className="save-button" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;