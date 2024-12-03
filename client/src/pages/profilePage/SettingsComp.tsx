import React, { useState } from "react";
import "../../styles/SettingsComponent.css";
// import { useLoginStatus } from "../../hooks/userLogin";

const SettingsComponent: React.FC = () => {
    // const { userData } = useLoginStatus();

    const [isExpanded, setIsExpanded] = useState({
        personalInfo: true,
        sosOptions: true,
        appearance: false,
        alerts: false,
    });

    const [sosSettings, setSosSettings] = useState({
        notifyContacts: true,
        notifyNearbyUsers: true,
        callAuthorities: true,
        shareMedia: false,
    });

    // Theme management
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme); // Update the theme attribute in the <html>
    };

    // Toggle section visibility
    const toggleSection = (section: keyof typeof isExpanded) => {
        setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSosClick = () => {
        if (sosSettings.notifyContacts) {
            alert("Sending SOS to emergency contacts...");
        }
        if (sosSettings.notifyNearbyUsers) {
            alert("Notifying nearby SafeWalk users...");
        }
        if (sosSettings.callAuthorities) {
            alert("Calling local authorities...");
            window.open("tel:112"); // Example emergency number
        }
        if (sosSettings.shareMedia) {
            alert("Sharing real-time audio or video...");
        }
    };

    const handleToggle = (option: keyof typeof sosSettings) => {
        setSosSettings((prev) => ({ ...prev, [option]: !prev[option] }));
    };

    return (
        <div className="settings-comp">
            <h3>Settings</h3>
            {/* SOS Options Section */}
            <section>
                <button className="dropdown-header" onClick={() => toggleSection("sosOptions")}>
                    SOS Button Options {isExpanded.sosOptions ? "▲" : "▼"}
                </button>
                {isExpanded.sosOptions && (
                    <div className="dropdown-content">
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
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={sosSettings.shareMedia}
                                    onChange={() => handleToggle("shareMedia")}
                                />
                                Share Real-Time Media
                            </label>
                        </div>
                    </div>
                )}
            </section>

            {/* Appearance Section */}
            <section>
                <button className="dropdown-header" onClick={() => toggleSection("appearance")}>
                    Appearance {isExpanded.appearance ? "▲" : "▼"}
                </button>
                {isExpanded.appearance && (
                    <div className="dropdown-content">
                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            Switch to {theme === "light" ? "Dark" : "Light"} Mode
                        </button>
                    </div>
                )}
            </section>

            {/* Alerts Section */}
            <section>
                <button className="dropdown-header" onClick={() => toggleSection("alerts")}>
                    Alerts {isExpanded.alerts ? "▲" : "▼"}
                </button>
                {isExpanded.alerts && (
                    <div className="dropdown-content">
                        <p className="alerts">Manage app alerts</p>
                    </div>
                )}
            </section>

            {/* Test SOS Button Section */}
            <section>
                <h3>Test SOS Button</h3>
                <button
                    className="sos-button"
                    onClick={handleSosClick}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "15px 30px",
                        fontSize: "20px",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    SOS
                </button>
            </section>
        </div>
    );
};

export default SettingsComponent;