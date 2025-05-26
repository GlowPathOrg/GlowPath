import React, { useState } from 'react';
import "../../styles/SosButton.css"

interface SOSButtonProps {
  onSOSActivated?: () => void; // Optional callback for additional logic when SOS is activated
}

const base_URL = import.meta.env.VITE_BACKEND_URL
if (!base_URL) {
  console.error('NO URL FOUND')
}


const SOSButton: React.FC<SOSButtonProps> = ({ onSOSActivated }) => {
  const [showContactSelector, setShowContactSelector] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const sosSettings = JSON.parse(localStorage.getItem('settings') || '{}');
  const sosMessage = sosSettings.sosMessage || 'Help me, I am in danger!';

  const handleSOSClick = async () => {
    if (!sosSettings) {
      alert('SOS settings not found! Please configure them in settings.');
      return;
    }

    // Check if emergency contacts are present
    if (sosSettings.notifyContacts) {
      if (sosSettings.emergencyContacts?.length > 0) {
        setShowContactSelector(true); // Show contact selector popup
      } else {
        alert('No emergency contacts found!');
      }
    }

    if (sosSettings.notifyNearbyUsers) {
      await notifyNearbyUsers();
    }

    if (sosSettings.callAuthorities) {
      callAuthorities();
    }

    // Optional callback
    if (onSOSActivated) {
      onSOSActivated();
    }
  };

  const handleSendSOS = async () => {
    if (selectedContact) {
      await notifyEmergencyContacts([selectedContact], sosMessage);
      alert(`SOS message sent to ${selectedContact}`);
      setShowContactSelector(false);
    } else {
      alert('Please select a contact to send the SOS message.');
    }
  };

  const notifyEmergencyContacts = async (contacts: string[], message: string) => {
    try {
      const response = await fetch(`${base_URL}/notify-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS notifications');
      }

      const result = await response.json();
      console.log('SMS notifications sent successfully:', result);
      alert('SMS notifications sent successfully!');
    } catch (error) {
      console.error('Error notifying emergency contacts:', error);
      alert('Failed to send SMS notifications. Please try again.');
    }
  };

  const notifyNearbyUsers = async () => {
    console.log('Notifying nearby SafeWalk users...');
    // Add WebSocket or real-time notification logic
    alert('Mock notification sent to nearby users.');
    return Promise.resolve();
  };

  const callAuthorities = () => {
    console.log('Calling local authorities...');
    alert('Mock call to emergency number triggered.');
    window.open('tel:112'); // Replace 112 with your emergency number
  };

  return (
    <div>
      {/* SOS Button */}
      <button
        className="sos-button"
        onClick={handleSOSClick}
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

      {/* Contact Selector Popup */}
      {showContactSelector && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <h3>Select Emergency Contact</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sosSettings.emergencyContacts?.map((contact: string, index: number) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    padding: '10px',
                    backgroundColor: selectedContact === contact ? 'green' : '#f0f0f0',
                    color: selectedContact === contact ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {contact}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleSendSOS}
              style={{
                padding: '10px 20px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Send SOS
            </button>
            <button
              onClick={() => setShowContactSelector(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;