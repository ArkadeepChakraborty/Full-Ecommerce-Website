import React from 'react'
import './Footer.css'
// import { assets } from '../../assets/assets'
import facebook_icon from '../../assets/facebook_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import linkedin_icon from '../../assets/linkedin_icon.png'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
            <div className='foodo'>Food Faction</div>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum in, beatae dolorem non optio cupiditate, quam sunt dicta dolores minima exercitationem ducimus totam aut asperiores inventore harum laudantium. Distinctio, libero.</p>
                <div className="footer-social-icons">
                    <img src={facebook_icon} alt="" />
                    <img src={twitter_icon} alt="" />
                    <img src={linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 8045678120</li>
                    <li>solmonbhaijan@gmail.com</li>
                </ul>
            </div>
           
        </div>
        <hr />
        <p className="footer-copyright">
            Copyright 2024 &copy; Education - All Right Reserved.
        </p>
    </div>
  )
}

export default Footer