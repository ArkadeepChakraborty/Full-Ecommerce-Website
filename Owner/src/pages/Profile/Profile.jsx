import React, { useState, useEffect } from "react";
import axios from "axios";
import { FcCamera } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("https://via.placeholder.com/100");
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/get`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserData(response.data.user);
        setProfileImagePreview(response.data.user.profile.profilePhoto);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dish_platter_preset");

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/de5oqwevm/image/upload`,
          formData
        );

        await axios.patch(
          "http://localhost:8000/api/v1/user/updateimage",
          { image: res.data.secure_url },
          { withCredentials: true }
        );

        setProfileImagePreview(res.data.secure_url);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }

      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/user/status1/${userData._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Status updated successfully.");
        setUserData({ ...userData, status: newStatus });
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.header
        className="headerof"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Profile</h2>
      </motion.header>

      <main className="content">
        <motion.div
          className="profile-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-photo-section">
            <label className="photo-upload-label">
              <motion.img
                src={profileImagePreview}
                alt="Profile"
                className="profile-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <div className="edit-icon">
                <FcCamera />
              </div>
            </label>
          </div>
          <motion.p
            className="highlight-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {userData.fullname}
          </motion.p>
          <motion.button
            className="learn-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LEARN MORE
          </motion.button>
        </motion.div>

        <motion.div
          className="services-grid"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {[
            { label: "Phone No:", value: userData.phoneNumber },
            { label: "Email:", value: userData.email },
            { label: "Role:", value: userData.role },
            { label: "Status:", value: userData.status || "Active" },
            // { label: "Bio:", value: userData.profile?.bio || "No Bio Available" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="service-card"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2>{item.label}</h2>
              <h3>{item.value}</h3>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <motion.div
        className="action-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="edith"
          onClick={handleEditClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit
        </motion.button>

        {/* Only show status dropdown if user is food provider */}
        {userData.role === "food_provider" && (
          <motion.select
            className="deleteh"
            value={userData.status || "Active"}
            onChange={handleStatusChange}
            whileHover={{ scale: 1.02 }}
          >
            <option value="Active" className="active">Active</option>
            <option value="Deactive" className="inactive">Deactive</option>
          </motion.select>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
