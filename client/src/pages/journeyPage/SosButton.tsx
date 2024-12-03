import React from 'react';

interface SOSButtonProps {
  onSOSActivated?: () => void; // Optional callback for additional logic when SOS is activated
}

const SOSButton: React.FC<SOSButtonProps> = ({ onSOSActivated }) => {
  const handleSOSClick = async () => {
    // Retrieve saved settings from localStorage
    const sosSettings = JSON.parse(localStorage.getItem('settings') || '{}');

    if (sosSettings.notifyContacts && sosSettings.emergencyContacts?.length > 0) {
      await notifyEmergencyContacts(sosSettings.emergencyContacts);
    } else if (sosSettings.notifyContacts) {
      alert('No emergency contacts found!');
    }

    if (sosSettings.notifyNearbyUsers) {
      await notifyNearbyUsers();
    }

    if (sosSettings.callAuthorities) {
      callAuthorities();
    }

    // Call an optional callback if provided
    if (onSOSActivated) {
      onSOSActivated();
    }
  };

  const notifyEmergencyContacts = async (contacts: string[]) => {
    console.log('Notifying contacts:', contacts);
    // I need to implement API logic to send notifications (e.g., email or SMS)
    return Promise.resolve();
  };

  const notifyNearbyUsers = async () => {
    console.log('Notifying nearby SafeWalk users...');
    // I need to implement WebSocket or real-time notification logic
    return Promise.resolve();
  };

  const callAuthorities = () => {
    console.log('Calling local authorities...');
    window.open('tel:112'); // Replace 112 with your emergency number
  };


  return (
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
  );
};

export default SOSButton;