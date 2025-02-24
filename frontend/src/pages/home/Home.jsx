import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar";
import { Button } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import * as VANTA from "vanta";
import NET from "vanta/dist/vanta.net.min";

const moviePosters = [
  { title: "Drishyam", image: "https://m.media-amazon.com/images/M/MV5BM2Q2YTczM2QtNDBkNC00M2I5LTkyMzgtOTMwNzQ0N2UyYWQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "Premam", image: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_.jpg" },
  { title: "Bangalore Days", image: "https://m.media-amazon.com/images/M/MV5BMzAyYzVhNDUtMzY1My00ZGYwLWE4NmEtMTlmMTEyYzI5NDI0XkEyXkFqcGc@._V1_.jpg" },
  { title: "Inception", image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg" },
  { title: "Interstellar", image: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg" },
  { title: "Avengers: Endgame", image: "https://m.media-amazon.com/images/I/81ExhpBEbHL.jpg" },
  { title: "Inside Out", image: "https://th.bing.com/th?id=OIF.Td%2b1XO2hXF7l1V7sHAS2RQ&rs=1&pid=ImgDetMain" },
  { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { title: "Dangal", image: "https://data1.ibtimes.co.in/en/full/619308/dangal.jpg" },
  { title: "Parasite", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
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
    <div className="home" ref={vantaRef}>
      <Navbar />

      <section className="hero">
        <h1 className="neon-text">WatchWise</h1>
        <p>Find Your Mood with Movies</p>
        <Button variant="contained" className="hero-btn">
          Start Watching
        </Button>
      </section>

      <section className="carousel-container">
        <div className="carousel" ref={carouselRef}>
          {extendedPosters.map((poster, index) => (
            <div key={index} className="carousel-item">
              <img src={poster.image} alt={poster.title} />
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 WatchWise. All rights reserved.</p>
      </footer>
    </div>
  );
}