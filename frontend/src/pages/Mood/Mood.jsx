import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Mood.css"; // Import external CSS
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { useEffect} from 'react';


const movieCategories = {
  "Malayalam Movies": [
    { title: "Drishyam", image: "https://m.media-amazon.com/images/M/MV5BM2Q2YTczM2QtNDBkNC00M2I5LTkyMzgtOTMwNzQ0N2UyYWQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Premam", image: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_.jpg" },
    { title: "Bangalore Days", image: "https://m.media-amazon.com/images/M/MV5BMzAyYzVhNDUtMzY1My00ZGYwLWE4NmEtMTlmMTEyYzI5NDI0XkEyXkFqcGc@._V1_.jpg" },
    { title: "Drishyam", image: "https://m.media-amazon.com/images/M/MV5BM2Q2YTczM2QtNDBkNC00M2I5LTkyMzgtOTMwNzQ0N2UyYWQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Premam", image: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_.jpg" },
    { title: "Bangalore Days", image: "https://m.media-amazon.com/images/M/MV5BMWI0YTgyNTEtNGU2Yi00MWQ5LWFiOTUtYTQ3MzMyNDcwYTIzXkEyXkFqcGc@._V1_.jpg" },
    { title: "Drishyam", image: "https://m.media-amazon.com/images/M/MV5BM2Q2YTczM2QtNDBkNC00M2I5LTkyMzgtOTMwNzQ0N2UyYWQ0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Premam", image: "https://m.media-amazon.com/images/M/MV5BNWJiMWMxYmMtNTQxMy00ZjE2LWEzYTAtNTdmODI4MGI4OTRlXkEyXkFqcGc@._V1_.jpg" },
    { title: "Bangalore Days", image: "https://m.media-amazon.com/images/M/MV5BMzAyYzVhNDUtMzY1My00ZGYwLWE4NmEtMTlmMTEyYzI5NDI0XkEyXkFqcGc@._V1_.jpg" },
    
  ],
  "English Movies": [
    { title: "Inception", image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg" },
    { title: "Interstellar", image: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg" },
    { title: "Avengers: Endgame", image: "https://m.media-amazon.com/images/I/81ExhpBEbHL.jpg" },
    { title: "Inception", image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg" },
    { title: "Interstellar", image: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg" },
    { title: "Avengers: Endgame", image: "https://m.media-amazon.com/images/I/81ExhpBEbHL.jpg" },
  ],
  "Hindi Movies": [
    { title: "Zindagi Na Milegi Dobara", image: "https://m.media-amazon.com/images/I/81jLiN3WzML.jpg" },
    { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
    { title: "Zindagi Na Milegi Dobara", image: "https://m.media-amazon.com/images/I/81jLiN3WzML.jpg" },
    { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
    { title: "Zindagi Na Milegi Dobara", image: "https://m.media-amazon.com/images/I/81jLiN3WzML.jpg" },
    { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
    { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
    { title: "Zindagi Na Milegi Dobara", image: "https://m.media-amazon.com/images/I/81jLiN3WzML.jpg" },
    { title: "3 Idiots", image: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Dangal", image: "https://m.media-amazon.com/images/M/MV5BMzQzMTA4ODY4OF5BMl5BanBnXkFtZTcwNjgyMDQxNw@@._V1_.jpg" },
  
  ],
};

export default function HomePage() {
  const navigate = useNavigate();
    
const [vantaEffect, setVantaEffect] = useState(null);
const vantaRef = useRef(null);

useEffect(() => {
    if (!vantaEffect && window.VANTA) {
        setVantaEffect(
            window.VANTA.NET({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0xdb0000,
                backgroundColor: 0x000000,
            })
        );
    }

    return () => {
        if (vantaEffect) vantaEffect.destroy();
    };
}, [vantaEffect]);
  const [mood, setMood] = useState("");

  return (
    <>
      <Navbar/>
      <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -1 }}></div>
      <div className="container" style={{ paddingTop: "100px" }}>
        {/* Mood Input Section */}
        <div className="mood-section" style={{ textAlign: "center" }}>
          <h2>How are you feeling today?</h2>
          <input
            type="text"
            className="mood-input"
            placeholder="Enter your mood..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <button className="mood-submit">Submit</button>
        </div>

        {/* Movie Categories */}
        <div className="category-container">
          {Object.keys(movieCategories).map((category) => (
            <MovieRow key={category} title={category} movies={movieCategories[category]} />
          ))}
        </div>
      </div>
    </>
  );
}

function MovieRow({ title, movies }) {
  const rowRef = useRef(null);

  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="movie-row">
      <h2 className="category-title">{title}</h2>
      <div className="row-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <ChevronLeft size={24} />
        </button>
        <div className="movie-list" ref={rowRef}>
          {movies.map((movie) => (
            <div key={movie.title} className="movie-item">
              <img src={movie.image} alt={movie.title} className="movie-image" />
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
