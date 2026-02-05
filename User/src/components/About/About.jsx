import React, { useEffect, useState } from "react";
import axios from "axios";
import "./About.css";

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/aboutAdmin/get");
        if (response.data.success) {
          setAboutData(response.data.data);
        } else {
          console.error("No content found");
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    fetchAboutContent();
  }, []);

  if (!aboutData) {
    return <div className="about-loading">Loading About Section...</div>;
  }

  return (
    <div className="containerrrr" id="about">
      <section className="about">
        <div className="about-images">
          {aboutData.image1 && <img src={aboutData.image1} alt="About 1" />}
          {aboutData.image2 && <img src={aboutData.image2} alt="About 2" />}
          {aboutData.image3 && <img src={aboutData.image3} alt="About 3" />}
          {aboutData.image4 && <img src={aboutData.image4} alt="About 4" />}
        </div>

        <div className="about-text">
          <h3 className="hhhh">About Us</h3>
          <h2 style={{ marginBottom: "15px" }}>{aboutData.title}</h2>
          <p className="pppp" style={{ marginBottom: "10px" }}>
            {aboutData.content}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
