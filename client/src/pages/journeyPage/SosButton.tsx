

const SosButton: React.FC = () => {
  const handleSOS = () => {
    alert('SOS Triggered! Sending help...');
    // we need to add more SOS functionality
  };

  return (
    <button className="sos-button" onClick={handleSOS}>
      SOS
    </button>
  );
};

export default SosButton;