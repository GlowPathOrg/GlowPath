import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <footer className="footer-bar">
      <button className="footer-icon" onClick={() => navigate("/")}>
      <img
        src="https://img.icons8.com/?size=100&id=Eyy3nmHIbCL8&format=png&color=F25081"
        alt="Search Icon"
        className="search-icon"></img>
    
      </button>


      <button className="footer-icon" onClick={() => navigate("/visualisations")}>
        <img
        src=" https://img.icons8.com/?size=100&id=eqDAmvHtEQLC&format=png&color=F25081"
        alt="Search Icon"
        className="search-icon"></img>
       
      </button>


      <button className="footer-icon" onClick={() => navigate("/profile")}>
      <img
        src="https://img.icons8.com/?size=100&id=4kuCnjaqo47m&format=png&color=F25081"
        alt="Search Icon"
        className="search-icon"></img>
      </button>
    </footer>
  );
};

export default Footer;