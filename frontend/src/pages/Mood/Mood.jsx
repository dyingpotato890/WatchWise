import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Mood.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([
    { poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg", title: "Inception" },
    { poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", title: "Interstellar" },
    { poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", title: "The Dark Knight" },
    { poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg", title: "Fight Club" },
    { poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", title: "The Matrix" },
    { poster: "https://image.tmdb.org/t/p/w500/tN8HnU7s54UTjTY3lWo4QlnCTwX.jpg", title: "Pulp Fiction" },
    { poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", title: "The Shawshank Redemption" },
    { poster: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", title: "Forrest Gump" },
    { poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", title: "Gladiator" },
    { poster: "https://image.tmdb.org/t/p/w500/kHXEpyfl6zqn8a6YuozZUujufXf.jpg", title: "Titanic" }
  ]);
  const [mood, setMood] = useState("");
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

  return (
    <>
      <Navbar />
      <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -1 }}></div>
      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="category-container">
          <MovieRow title="Recommendations" movies={recommendations} />
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
              <img src={movie.poster} alt={movie.title} className="movie-image" />
              <p className="movie-title">{movie.title}</p>
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
