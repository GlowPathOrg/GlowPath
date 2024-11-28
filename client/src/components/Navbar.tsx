import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"

const Navbar: React.FC = () => {
   const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
        // Check token to determine login state whenever component renders
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Update login state based on token presence
    }, []); // Depend on isLoggedIn to re-run when it changes



  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout
    setIsLoggedIn(false); // Update login state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link className='logo-container' to="/">GlowPathLogo</Link>
      </div>
       <div className="nav-links">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
            <>
              <div><Link to="/login">Login </Link></div>
            <div><Link to="/register">Register </Link></div>
            </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
