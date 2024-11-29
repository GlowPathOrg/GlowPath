import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css"

const Navbar: React.FC = () => {
   const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();
  const currentPath = location.pathname;


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
        <Link className="logo-container" to="/">GlowPathLogo</Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            {currentPath !== "/me" && <div><Link to="/me">My Profile</Link></div>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            {currentPath !== "/login" && <div><Link to="/login">Login</Link></div>}
            {currentPath !== "/register" && <div><Link to="/register">Register</Link></div>}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
