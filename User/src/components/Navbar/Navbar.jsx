import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import profile_icon from '../../assets/profile_icon.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserAlt, FaSignOutAlt, FaShoppingCart, FaHome } from "react-icons/fa";
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    getCartCount();
  }, []);

  // Simplified Navbar for special routes
  const simplifiedRoutes = ["/top-dishes", "/top-dish", "/details", "/detail", "/cart"];
  if (simplifiedRoutes.includes(location.pathname)) {
    return (
      <div className='navbar simplified-navbar'>
        <Link to='/'><div className='food simplified-title'>Food Faction</div></Link>
        <ul className="navbar-menu">
          <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>Home</Link>
          <Link to="/about" onClick={() => setMenu('about')} className={menu === 'about' ? 'active' : ''}>About</Link>
          <Link to="/explore-menu-list" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</Link>
          <Link to="/viewfoodcart" onClick={() => setMenu('Food Carts')} className={menu === 'Food Carts' ? 'active' : ''}>Food Carts</Link>
          <a href='#footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
        </ul>
        <div className="navbar-right">
          <button onClick={logout} className="logout-button"><FaSignOutAlt /></button>
        </div>
      </div>
    );
  }

  if (location.pathname === '/review') {
    return (
      <div className="custom-navbar">
        <div className="custom-navbar-left">
          <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'custom-active' : ''}>
            <FaHome style={{ fontSize: '30px' }} />
          </Link>
          <div className="custom-navbar-title">FOOD FACTION</div>
        </div>
        <div className="custom-navbar-right">
          <button onClick={logout} className="custom-logout-button"><FaSignOutAlt /></button>
        </div>
      </div>
    );
  }

  // Default full Navbar
  return (
    <div className='navbar'>
      <Link to='/'><div className='food'>Food Faction</div></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>Home</Link>
        <Link to="/about" onClick={() => setMenu('about')} className={menu === 'about' ? 'active' : ''}>About</Link>
        <Link to="/explore-menu-list" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</Link>
        <Link to="/viewfoodcart" onClick={() => setMenu('Food Carts')} className={menu === 'Food Carts' ? 'active' : ''}>Food Carts</Link>
        <a href='#footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart"><FaShoppingCart style={{ fontSize: '30px' }} /></Link>
          {isAuthenticated && cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </div>
        {!isAuthenticated ? (
          <button onClick={() => setShowLogin(true)}><FaUserAlt /> Sign in</button>
        ) : (
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={profile_icon} alt="Profile" width={35} height={35} />
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/account">Your Account</Link></li>
                <li><Link to="/wishlist">Your Wishlist</Link></li>
                <li><Link to="/myorders">Your Orders</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
