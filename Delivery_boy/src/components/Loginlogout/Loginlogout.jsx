// components/Loginlogout/Login.jsx
import React, { useState } from 'react';
import './Loginlogout.css';
import crossIcon from '../../assets/cross-23.png';
import ForgetPassword from '../ForgetPassword/ForgetPassword.jsx';
import { useAuth } from '../../Context/AuthContext';

const Login = ({ setShowLogin }) => {
  const { setUser } = useAuth();
  const [showForget, setShowForget] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/deliveryBoy/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.deliveryBoy);
        alert(`Welcome back ${data.deliveryBoy.fullname}`);
        setShowLogin(false);
        window.location.href = '/';
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (showForget) return <ForgetPassword setShowForget={setShowForget} />;

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2>Login</h2>
          <img className="login-close-icon" src={crossIcon} alt="Close" onClick={() => setShowLogin(false)} />
        </div>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
        <p className="info-text">If You are first here, then <span className="linkish">Update your Password Below</span></p>
        <p className="toggle-mode">Forgot Password? <span onClick={() => setShowForget(true)}>Click here</span></p>
      </form>
    </div>
  );
};

export default Login;
