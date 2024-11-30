import React, { useState } from 'react';
import '../../styles/SettingsComp.css'

const SettingsComponent: React.FC = () => {
    // State for SOS settings
    const [sosSettings, setSosSettings] = useState({
        notifyContacts: true,
        notifyNearbyUsers: true,
        callAuthorities: true,
        shareMedia: false, // Default to off
    });

    // State for theme (light or dark)
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Apply theme dynamically by toggling a CSS class
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme); // Update the theme attribute in the <html>
    };

    // Handle SOS button click
    const handleSosClick = () => {
        if (sosSettings.notifyContacts) {
            alert('Sending SOS to emergency contacts...');
            // Implement API or SMS logic here
        }
        if (sosSettings.notifyNearbyUsers) {
            alert('Notifying nearby SafeWalk users...');
            // Implement real-time notification logic here
        }
        if (sosSettings.callAuthorities) {
            alert('Calling local authorities...');
            window.open('tel:112'); // Example emergency number
        }
        if (sosSettings.shareMedia) {
            alert('Sharing real-time audio or video...');
            // Implement media sharing logic here
        }
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
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={sosSettings.shareMedia}
                            onChange={() => handleToggle('shareMedia')}
                        />
                        Share Real-Time Media
                    </label>
                </div>
            </section>

            {/* Appearance Section */}
            <section>
                <h2>Appearance</h2>
                <button className="theme-toggle-button" onClick={toggleTheme}>
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
            </section>

            <section>
                <h2>Alerts</h2>
                <p className="alerts">
                    mange the app alerts
                </p>
            </section>

            {/* Test SOS Button */}
            <section>
                <h2>Test SOS Button</h2>
                <button
                    className="sos-button"
                    onClick={handleSosClick}
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '15px 30px',
                        fontSize: '20px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                >
                    SOS
                </button>
            </section>
        </div>
    );
};

export default SettingsComponent;