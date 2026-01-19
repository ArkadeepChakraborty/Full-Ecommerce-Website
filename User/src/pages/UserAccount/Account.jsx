import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcCamera } from 'react-icons/fc';
import axios from 'axios';
import './Account.css';
import { useAuth } from '../../components/Context/AuthContext';

const Account = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profile?.profilePhoto || 'https://via.placeholder.com/150'
  );
  const navigate = useNavigate();

  // 🔁 Sync profile image whenever user updates
  useEffect(() => {
    if (user?.profile?.profilePhoto) {
      setProfileImagePreview(user.profile.profilePhoto);
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dish_platter_preset");

    try {
      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/de5oqwevm/image/upload',
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      const updateRes = await axios.patch(
        'http://localhost:8000/api/v1/user/updateimage',
        { image: imageUrl },
        { withCredentials: true }
      );

      if (updateRes.data.success) {
        setProfileImagePreview(imageUrl);
        setUser(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePhoto: imageUrl,
          },
        }));
      } else {
        console.error("Image update failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/user/delete/${user._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        alert("Account deleted successfully.");
        localStorage.removeItem('userName');
        setUser(null); // Clear auth context
        navigate("/");
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!isAuthenticated || !user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-left">
        <div className="profile-photo-section">
          <label className="photo-upload-label">
            <img src={profileImagePreview} alt="Profile" className="profile-image" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            <div className="edit-icon"><FcCamera /></div>
          </label>
        </div>
        <h3 className="profile-name">Hi, {user.fullname}</h3>
      </div>

      <div className="profile-right">
        <h1 className="title">Account Details</h1>
        <div className="step">
          <p><strong className='s'>Name:</strong> {user.fullname}</p>
          <p><strong className='s'>Address:</strong> {user.profile?.address || "Not added"}</p>
          <p><strong className='s'>Phone No:</strong> {user.phoneNumber}</p>
          <p><strong className='s'>Email:</strong> {user.email}</p>
          <p><strong className='s'>Bio:</strong> {user.profile?.bio || "No bio added"}</p>
        </div>
        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEditClick}>Edit Account</button>
          <button className="delete-btn" onClick={handleDeleteClick}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
