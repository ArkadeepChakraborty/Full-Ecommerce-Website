import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete, AiOutlineStop } from "react-icons/ai";
import { TbHandClick } from "react-icons/tb";
import axios from "axios";
import "./HomePage.css";
import { Companyapi } from "../../utils/datauri.js";
import { motion } from 'framer-motion';

const Homepage = () => {
  const [foodCounters, setFoodCounters] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/get", {
        withCredentials: true,
      });
      setUserData(res.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFoodCounters = async () => {
    try {
      const response = await axios.get(`${Companyapi}/get`, {
        withCredentials: true,
      });
      setFoodCounters(response.data.food_counters || []);
    } catch (error) {
      console.error("Error fetching food counters:", error);
    }
  };

  const deleteFoodCounter = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this food counter?");
      if (!confirmDelete) return;

      const response = await axios.delete(`${Companyapi}/delete/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setFoodCounters((prev) => prev.filter(fc => fc._id !== id));
      } else {
        console.error("Failed to delete food counter:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting food counter:", error);
    }
  };

  useEffect(() => {
    const tokenExists = document.cookie.split(";").some((item) =>
      item.trim().startsWith("token=")
    );

    if (tokenExists) {
      fetchUser();
      fetchFoodCounters();
    } else {
      console.warn("No token found in cookies. Skipping fetch.");
    }
  }, []);

  return (
    <motion.div
      className="job-portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="food-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="One">Food Faction</h1>
        <p className="Two">Order Your Favourite Food Here</p>
      </motion.div>

      {userData?.status === "Deactive" ? (
        <motion.div
          className="company-container"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fcdetailsss">User is Deactive right Now.<br/>
          Stay Tuned! We will Come up Quickly</h2>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="company-container"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="fcdetails">Your Food Cart Details</h2>
          </motion.div>

          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Open</th>
                <th>Status</th>
                <th>Location</th> {/* ✅ Added Location Column */}
                <th>Products</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {foodCounters.length > 0 ? (
                foodCounters.map((fc, index) => (
                  <motion.tr
                    key={fc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <img
                        src={fc.logo}
                        alt={fc.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{fc.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      {fc.opening_hours?.start} - {fc.opening_hours?.end}
                    </td>
                    <td style={{ textAlign: 'center' }}>{fc.status}</td>
                    <td style={{ textAlign: 'center' }}>{fc.location || "Not Provided"}</td> {/* ✅ Show Location */}
                    <td style={{ textAlign: 'center' }}>
                      {fc.status === "Closed" ? (
                        <motion.button
                          className="buttonone"
                          disabled
                          title="The Counter is Closed Now"
                          style={{ cursor: "not-allowed" }}
                        >
                          <AiOutlineStop style={{ fontSize: '20px' }} />
                        </motion.button>
                      ) : (
                        <Link to={`/list/${fc._id}`}>
                          <motion.button
                            className="buttonone"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <TbHandClick style={{ fontSize: '20px' }} />
                          </motion.button>
                        </Link>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <motion.button
                        className="buttonone"
                        onClick={() => navigate(`/edit/${fc._id}`)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaRegEdit style={{ fontSize: '18px' }} />
                      </motion.button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <motion.button
                        className="buttonone"
                        onClick={() => deleteFoodCounter(fc._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AiFillDelete style={{ fontSize: '18px' }} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-message">No food counters found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </motion.div>
  );
};

export default Homepage;
