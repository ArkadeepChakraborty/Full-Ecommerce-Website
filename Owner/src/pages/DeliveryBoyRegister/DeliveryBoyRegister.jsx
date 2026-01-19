import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeliveryBoy.css";
import { motion } from "framer-motion";

const DeliveryBoyRegister = () => {
  const [mode, setMode] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    foodCart: "",
  });
  const [foodCarts, setFoodCarts] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchFoodCarts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/foodcounter/get", {
        withCredentials: true,
      });
      if (res.data.success) {
        setFoodCarts(res.data.food_counters);
      }
    } catch (err) {
      console.error("Error fetching food counters:", err);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/delivery/getAll", {
        withCredentials: true,
      });
      if (res.data.success) {
        setDeliveryBoys(res.data.delivery_boys);
      }
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
    }
  };

  useEffect(() => {
    fetchFoodCarts();
  }, []);

  useEffect(() => {
    if (mode === "update") {
      fetchDeliveryBoys();
    }
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, foodCart } = formData;

    if (!foodCart || (mode === "register" && (!name || !email || !password)) || (mode === "update" && !name)) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (mode === "register") {
        const res = await axios.post("http://localhost:8000/api/v1/delivery/register", formData, {
          withCredentials: true,
        });
        if (res.data.success) {
          alert("Delivery Boy Registered Successfully!");
          setFormData({ name: "", email: "", password: "", foodCart: "" });
        } else {
          alert(res.data.message || "Registration failed.");
        }
      } else {
        const res = await axios.put("http://localhost:8000/api/v1/delivery/update", {
          name,
          foodCart
        }, {
          withCredentials: true,
        });
        if (res.data.success) {
          alert("Delivery Boy Updated Successfully!");
          setFormData({ name: "", email: "", password: "", foodCart: "" });
        } else {
          alert(res.data.message || "Update failed.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!formData.name) {
      alert("Please select a delivery boy to delete.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to remove this delivery boy?");
    if (!confirm) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/delivery/delete/${formData.name}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Delivery Boy Deleted Successfully!");
        setFormData({ name: "", email: "", password: "", foodCart: "" });
        fetchDeliveryBoys(); // refresh list
      } else {
        alert(res.data.message || "Deletion failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <motion.div
      className="delivery-boy-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="db-header"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={`db-switch-button ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
        <button
          className={`db-switch-button ${mode === "update" ? "active" : ""}`}
          onClick={() => setMode("update")}
        >
          Update & Remove
        </button>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="db-form"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {mode === "register" ? (
          <>
            <motion.label className="db-label">Name:</motion.label>
            <motion.input
              className="db-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <motion.label className="db-label">Email:</motion.label>
            <motion.input
              className="db-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <motion.label className="db-label">Password:</motion.label>
            <motion.input
              className="db-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <motion.label className="db-label">Select Delivery Boy:</motion.label>
            <motion.select
              className="db-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Delivery Boy --</option>
              {deliveryBoys.map((boy) => (
                <option key={boy._id} value={boy.name}>
                  {boy.name}
                </option>
              ))}
            </motion.select>
          </>
        )}

        <motion.label className="db-label">Select Food Cart:</motion.label>
        <motion.select
          className="db-input"
          name="foodCart"
          value={formData.foodCart}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Cart --</option>
          {foodCarts.map((cart) => (
            <option key={cart._id} value={cart._id}>
              {cart.name}
            </option>
          ))}
        </motion.select>

        <motion.button
          type="submit"
          className="db-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode === "register" ? "Register" : "Update"}
        </motion.button>

        {mode === "update" && (
          <motion.button
            type="button"
            className="db-button db-remove"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Remove
          </motion.button>
        )}
      </motion.form>
    </motion.div>
  );
};

export default DeliveryBoyRegister;
