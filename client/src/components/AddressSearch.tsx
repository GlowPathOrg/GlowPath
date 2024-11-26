import { useState } from 'react';

interface AddressSearchProps {
  // Callback to handle the search
  onSearch: (address: string) => void; 
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSearch }) => {
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    if (address.trim()) {
      onSearch(address); 
    }
  };

  return (
    <div className="address-search">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter an address..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AddressSearch;