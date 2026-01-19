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
        <p className='content'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique dolorem, dicta itaque iure fugiat architecto.</p>
        <a href="#menu"><button className = "butn" onClick={scrollToSection}>View Menu</button></a>
      </div>
    </div>
  );
};

export default Header;
