// import React, { useEffect, useRef } from "react";
// import "./Testimonials.css";

// const testimonials = [
//   {
//     id: 1,
//     message:
//       "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam.",
//     clientName: "Client Name",
//     profession: "Profession",
//     image: "https://via.placeholder.com/60", // Placeholder image
//   },
//   {
//     id: 2,
//     message:
//       "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam.",
//     clientName: "Client Name",
//     profession: "Profession",
//     image: "https://via.placeholder.com/60", // Placeholder image
//   },
//   {
//     id: 3,
//     message:
//       "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam.",
//     clientName: "Client Name",
//     profession: "Profession",
//     image: "https://via.placeholder.com/60", // Placeholder image
//   },
//   {
//     id: 4,
//     message:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget justo sed lacus suscipit efficitur.",
//     clientName: "Client Name",
//     profession: "Profession",
//     image: "https://via.placeholder.com/60",
//   },
//   {
//     id: 5,
//     message:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget justo sed lacus suscipit efficitur.",
//     clientName: "Client Name",
//     profession: "Profession",
//     image: "https://via.placeholder.com/60",
//   },
// ];

// const Testimonials = () => {
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (scrollRef.current) {
//         scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

//         // If reached the end, scroll back to start
//         if (
//           scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
//           scrollRef.current.scrollWidth
//         ) {
//           setTimeout(() => {
//             scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
//           }, 1000);
//         }
//       }
//     }, 3000); // Change slides every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="testimonial-container">
//       <h2 className="testimonial-title">Our Clients Say!</h2>
//       <p className="testimonial-subtitle">
//         Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore
//         lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero
//         dolor duo.
//       </p>

//       <div className="testimonial-wrapper">
//         <div className="testimonial-content" ref={scrollRef}>
//           {testimonials.map((testimonial) => (
//             <div className="testimonial-card" key={testimonial.id}>
//               <p className="testimonial-text">{testimonial.message}</p>
//               <div className="client-info">
//                 <img
//                   src={testimonial.image}
//                   alt={testimonial.clientName}
//                   className="client-image"
//                 />
//                 <div>
//                   <p className="client-name">
//                     <strong>{testimonial.clientName}</strong>
//                   </p>
//                   <p className="client-profession">{testimonial.profession}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Testimonials;


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Testimonials.css";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/review/recent");
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          setTimeout(() => {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          }, 1000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial-containerxx">
      <h2 className="testimonial-title">Our Clients Say!</h2>
      <p className="testimonial-subtitle">
        Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit.
      </p>

      <div className="testimonial-wrapper">
        <div className="testimonial-content" ref={scrollRef}>
          {reviews.map((review) => (
            <div className="testimonial-card" key={review._id}>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={review.rating >= star ? "star active" : "star"}>
                    ★
                  </span>
                ))}
              </div>
              <p className="testimonial-text">"{review.thoughts}"</p>
              <p className="client-name"><strong>{review.name}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
