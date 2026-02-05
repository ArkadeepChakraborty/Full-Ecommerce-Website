import React from 'react';
import './Header.css';

const Header = () => {
  const scrollToSection = () => {
    const section = document.getElementById('explore-menu');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p className='content'>Craving something delicious? Explore our menu and order your favorites in seconds.</p>
        <a href="#menu"><button className = "butn" onClick={scrollToSection}>View Menu</button></a>
      </div>
    </div>
  );
};

export default Header;
