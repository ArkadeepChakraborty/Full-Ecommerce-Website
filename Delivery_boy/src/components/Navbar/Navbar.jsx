// components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { motion } from 'framer-motion';
import axios from 'axios';
import Login from '../Loginlogout/Loginlogout';
import './Navbar.css';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState("https://via.placeholder.com/100");

  const { user, setUser } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  useEffect(() => {
    if (user?.profilePhoto) {
      setProfileImagePreview(user.profilePhoto);
    } else {
      setProfileImagePreview("https://via.placeholder.com/100");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const logout = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/deliveryBoy/logout', {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(null);
        setShowDropdown(false);
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="navbar">
      <motion.div className="logo" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Link to='/'><span className="logo-bold">Food</span></Link>
        <Link to='/'><span className="logo-light"> Faction</span></Link>
      </motion.div>

      <div className="navbar-right">
        {user ? (
          <div className="dropdown" ref={dropdownRef}>
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

      {showLogin && <Login setShowLogin={setShowLogin} />}
    </div>
  );
};

export default Navbar;
