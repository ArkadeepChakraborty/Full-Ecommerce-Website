import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Companyapi } from "../../utils/datauri.js";
import "./EditFoodCounter.css";

const EditFoodCounter = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [foodCounter, setFoodCounter] = useState({
    name: "",
    description: "",
    opening_hours: { start: "", end: "" },
    status: "",
    logo: null,
    logoPreview: "", // for preview
  });
  

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await axios.get(`${Companyapi}/get/${params.id}`, {
          withCredentials: true,
        });
  
        const { name, description, opening_hours, status, logo } = response.data.foodCounter;
  
        setFoodCounter({
          name,
          description,
          opening_hours: opening_hours || { start: "", end: "" },
          status,
          logo: null, // important
          logoPreview: logo || "", // important
        });
      } catch (error) {
        console.error("Error fetching food counter by ID:", error);
      }
    };
  
    fetchCounter();
  }, [params.id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodCounter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpeningHoursChange = (e) => {
    const { name, value } = e.target;
    setFoodCounter((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoodCounter((prev) => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };
  

  // const handleImageUpload = (e) => {
  //   const logo = e.target.files?.[0];
  //   setFoodCounter((prev) => ({
  //     ...prev,
  //     logo,
  //     preview: logo ? URL.createObjectURL(logo) : prev.preview,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, opening_hours, status, logo } = foodCounter;

    if (!name || !description || !opening_hours.start || !opening_hours.end || !status) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", foodCounter.name);
    formData.append("description", foodCounter.description);
    formData.append("opening_hours", JSON.stringify(foodCounter.opening_hours));
    formData.append("status", foodCounter.status);
    if (foodCounter.logo) {
      formData.append("file", foodCounter.logo);
    }
    console.log("FormData content:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    console.log(92, formData)
    console.log(params.id)

    try {
      const response = await axios.put(`${Companyapi}/update/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Food Counter updated successfully.");
        navigate("/");
      } else {
        alert(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating food counter:", error);
      alert("Error updating food counter.");
    }
  };

  return (
    <div className="edit-form-container">
      <h2>Edit Food Counter</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={foodCounter.name}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={foodCounter.description}
          onChange={handleChange}
          required
        />

        <label>Opening Hours:</label>
        <div className="opening-hours">
          <input
            type="text"
            name="start"
            value={foodCounter.opening_hours.start}
            onChange={handleOpeningHoursChange}
            required
          />
          <span>to</span>
          <input
            type="text"
            name="end"
            value={foodCounter.opening_hours.end}
            onChange={handleOpeningHoursChange}
            required
          />
        </div>

        <label>Status:</label>
        <select
        name="status"
        value={foodCounter.status}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option value="Open">Open</option>    
        <option value="Closed">Closed</option>
      </select>

        <label>Logo:</label>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {foodCounter.logoPreview && (
          <img src={foodCounter.logoPreview} alt="Logo Preview" width="80" />
        )}


        <button type="submit">Update Counter</button>
      </form>
    </div>
  );
};

export default EditFoodCounter;
