import React, { useState, useEffect } from "react";
import "../styles/ContactManagerPage.css"

const ContactManagerPage: React.FC = () => {
  const [contacts, setContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState<string>("");

  // Load contacts from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    setContacts(savedSettings.emergencyContacts || []);
  }, []);

  // Save contacts to localStorage
  const saveContacts = (updatedContacts: string[]) => {
    setContacts(updatedContacts);
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    const updatedSettings = { ...savedSettings, emergencyContacts: updatedContacts };
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  // Add a new contact
  const addContact = () => {
    if (newContact && !contacts.includes(newContact)) {
      saveContacts([...contacts, newContact]);
      setNewContact(""); // Clear input field
    } else if (!newContact) {
      alert("Contact cannot be empty!");
    } else {
      alert("Contact already exists!");
    }
  };

  // Remove a contact
  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, idx) => idx !== index);
    saveContacts(updatedContacts);
  };

  return (
    <div className="contact-manager-page">
      <h1>Manage Emergency Contacts</h1>
      <div className="contact-input-container">
        <input
          type="text"
          placeholder="Enter contact (phone or email)"
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
        />
        <button onClick={addContact}>Add Contact</button>
      </div>
      <ul className="contact-list">
        {contacts.map((contact, idx) => (
          <li className="contact-list-item" key={idx}>
            <span>{contact}</span>
            <button onClick={() => removeContact(idx)}>Remove</button>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => window.history.back()}>
        Back to Settings
      </button>
    </div>
  );
};

export default ContactManagerPage;