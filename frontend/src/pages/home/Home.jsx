import React, { useEffect, useRef, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "./Home.css";
import Navbar from "../../components/Navbar";
import { Button, Snackbar, Alert } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import * as VANTA from "vanta";
import NET from "vanta/dist/vanta.net.min";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const moviePosters = [
  { title: "Drishyam", image: "https://m.media-amazon.com/images/M/MV5BM2Q2YTczM2QtNDBkNC00M2I5LTkyMzgtOTMwNzQ0N2UyYWQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "Premam", image: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_.jpg" },
  { title: "Bangalore Days", image: "https://m.media-amazon.com/images/M/MV5BMzAyYzVhNDUtMzY1My00ZGYwLWE4NmEtMTlmMTEyYzI5NDI0XkEyXkFqcGc@._V1_.jpg" },
  { title: "Inception", image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg" },
  { title: "Interstellar", image: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg" },
  { title: "Avengers: Endgame", image: "https://m.media-amazon.com/images/I/81ExhpBEbHL.jpg" },
  { title: "Inside Out", image: "https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_SX300.jpg" },
  { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg" },
  { title: "Parasite", image: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg" },
  { title: "Chhichhore", image: "https://i.pinimg.com/736x/e1/a1/30/e1a13093e696cd87e384e3682bbf3929.jpg" },
  { title: "Shutter Island", image: "https://th.bing.com/th/id/OIP.dbwuhFb2ByKdlEbP3sN6BwHaLH?rs=1&pid=ImgDetMain" },
  { title: "Toy Story", image: "https://th.bing.com/th/id/OIP.NbKHsm69v7kEnKee_OeqUgHaK-?rs=1&pid=ImgDetMain" },
  { title: "Harry Potter and The Goblet Of Fire", image: "https://m.media-amazon.com/images/M/MV5BMTI1NDMyMjExOF5BMl5BanBnXkFtZTcwOTc4MjQzMQ@@._V1_.jpg" },
];

// Duplicate posters for smooth infinite scrolling
const extendedPosters = [...moviePosters, ...moviePosters];

export default function Home() {
  const carouselRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current path

    // Scroll to top when the component mounts or the path changes
    useEffect(() => {
        if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleStartWatching = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
    if (!isLoggedIn) {
      setOpenSnackbar(true); // Show alert if not logged in
    } else {
      navigate("/chat"); // Navigate to the mood page if logged in
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/submit-contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Vanta.js background effect
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xdb0000, // Red color for the net effect
          backgroundColor: 0x000000, // Black background
        })
      );
    }
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, [vantaEffect]);

  return (
    <div className="home">
      {/* Vanta.js background container */}
      <div ref={vantaRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}></div>

      <Navbar />

      <section className="hero">
        <h1 className="neon-text" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          WatchWise
        </h1>
        <p>Find Your Mood with Movies</p>
        <Button variant="contained" className="hero-btn" onClick={handleStartWatching}>
          Start Watching
        </Button>
      </section>

      {/* Rest of your code remains unchanged */}
      <section className="carousel-container">
        <div className="carousel" ref={carouselRef}>
          {extendedPosters.map((poster, index) => (
            <div key={index} className="carousel-item">
              <img src={poster.image} alt={poster.title} />
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-section">
        <div className="about-content">
          <h2 className="about-title">
            <span className="dynamic-gradient-text">About WatchWise</span>
            <div className="title-underline"></div>
          </h2>

          <p className="about-description">
            Ever spent ages scrolling, trying to pick the perfect movie? WatchWise has you covered!  
            We don’t just throw random suggestions at you—we use AI and sentiment analysis  
            to figure out how you’re feeling and recommend movies that match your mood.
          </p>

          <div className="about-features">
            <div className="feature-card">
              <span className="material-symbols-outlined">psychology</span>
              <h3 className="feature-title">Mood Detection</h3>
              <p>Tell us how you're feeling, and we’ll do the rest! Our AI finds movies that fit your vibe.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined">mood</span>
              <h3 className="feature-title">Mood Matching</h3>
              <p>Some movies just *feel right* at the perfect moment. We match films to your emotions.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined">star_rate</span>
              <h3 className="feature-title">Smarter Every Time</h3>
              <p>The more you watch, the better we get! WatchWise refines recommendations with your feedback.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined">search</span>
              <h3 className="feature-title">Effortless Discovery</h3>
              <p>Search by genre and language to find the right movie—no endless scrolling required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="contact-section">
        <div className="contact-content">
          <h2 className="contact-title">
            <span className="gradient-text">Contact Us</span>
            <div className="title-underline"></div>
          </h2>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-card">
                <div className="info-heading">
                  <span className="material-symbols-outlined">location_on</span>
                  <h3>Our Location</h3>
                </div>
                <p>
                  Govt. Model Engineering College, Thrikkakara
                  <br />
                  Ernakulam, Kerala
                  <br />
                  India
                </p>
              </div>

              <div className="info-card">
                <div className="info-heading">
                  <span className="material-symbols-outlined">mail</span>
                  <h3>Email Us</h3>
                </div>
                <p>
                  info@watchwise.com
                  <br />
                  support@watchwise.com
                </p>
              </div>

              <div className="info-card">
                <div className="info-heading">
                  <span className="material-symbols-outlined">call</span>
                  <h3>Call Us</h3>
                </div>
                <p>
                  0484 257 7379
                  <br />
                  Mon-Fri: 9:00 AM - 6:00 PM
                </p>
              </div>

              <div className="social-links">
                <a href="#" className="social-link">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="social-link">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="social-link">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className="social-link">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{ textAlign: "left", display: "block", marginBottom: "8px", fontWeight: "600" }}>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "25px",
                    padding: "10px 20px",
                    paddingLeft: "20px",
                    border: "1px solid rgba(255, 75, 75, 0.5)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    width: "100%",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ textAlign: "left", display: "block", marginBottom: "8px", fontWeight: "600" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "25px",
                    padding: "10px 20px",
                    paddingLeft: "20px",
                    border: "1px solid rgba(255, 75, 75, 0.5)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    width: "100%",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ textAlign: "left", display: "block", marginBottom: "8px", fontWeight: "600" }}>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "25px",
                    padding: "10px 20px",
                    border: "1px solid rgba(255, 75, 75, 0.5)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    width: "100%",
                    transition: "all 0.3s ease",
                    appearance: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff416c'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 15px center",
                    backgroundSize: "12px",
                    paddingRight: "40px",
                  }}
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Business Partnership</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ textAlign: "left", display: "block", marginBottom: "8px", fontWeight: "600" }}>Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    paddingLeft: "20px",
                    border: "1px solid rgba(255, 75, 75, 0.5)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    width: "100%",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-button"
                style={{
                  borderRadius: "25px",
                  padding: "12px 20px",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>send</span>
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 WatchWise. All rights reserved.</p>
      </footer>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: "100%" }}>
          Login to continue!
        </Alert>
      </Snackbar>
    </div>
  );
}
