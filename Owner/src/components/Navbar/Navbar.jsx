import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { motion } from 'framer-motion';
import Login from '../Loginlogout/Loginlogout';
import './Navbar.css';
import axios from "axios";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menu, setMenu] = useState('home');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImagePreview, setProfileImagePreview] = useState("https://via.placeholder.com/100");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/get`, {
        withCredentials: true,
      });
      console.log(27, response);
      if (response.data.success) {
        setUser(response.data.user);
        setProfileImagePreview(response.data.user.profile.profilePhoto);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const tokenExists = document.cookie.split(";").some((item) =>
      item.trim().startsWith("token=")
    );

    if (tokenExists) {
      fetchUserData();
    } else {
      console.warn("No token found in cookies. Skipping fetch.");
    }
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(null);
        localStorage.removeItem("userName");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navbar">
      <motion.div
        className="logo"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Link to='/'><span className="logo-bold">Food</span></Link>
        <Link to='/'><span className="logo-light"> Faction</span></Link>
      </motion.div>

      {user && (
        <ul className='ulclass'>
          <Link to="/company" className="nav-link">New Company</Link>
          <Link to="/orderlist" className="nav-link">Orderlist</Link>
          {/* <Link to="/dboy" className="nav-link">Delivary Boy</Link> */}
          <a href='#footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
        </ul>
      )}

      <div className="navbar-right">
        {user ? (
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={profileImagePreview} alt="Profile" />
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/profile">Your Account</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            )}
          </div>
        ) : (
          <button className="signin-button" onClick={() => setShowLogin(true)}>
            <FaUser /> Sign In
          </button>
        )}
      </div>

      {showLogin && <Login setShowLogin={setShowLogin} setUser={setUser} />}
    </div>
  );
};

export default Navbar;
