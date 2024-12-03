import React, { useState, useEffect } from "react";

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Manage Emergency Contacts</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter contact (phone or email)"
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={addContact}
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Contact
        </button>
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {contacts.map((contact, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "400px",
            }}
          >
            <span>{contact}</span>
            <button
              onClick={() => removeContact(idx)}
              style={{
                padding: "5px 10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Settings
      </button>
    </div>
  );
};

export default ContactManagerPage;