import React, { useState, useEffect, useRef } from "react";
import "./Recommendation.css";
import Navbar from "../../components/Navbar";
import NET from "vanta/dist/vanta.net.min";

// Initial empty movie list
const initialMovies = [];

// Function to fetch movies from the backend API
const fetchMovies = async (setMovies) => {
  console.log("fetchMovies function called!"); // Debugging Log
  try {
    const response = await fetch("http://localhost:5010/api/movies");
    console.log("API Response Status:", response.status);
    if (response.status === 204) {
      console.log("No recommendations found.");
      return;
    }
    const data = await response.json();
    console.log("Raw Movies Data:", data);

    // Validate the movies array and provide fallback values
    const validMovies = data.movies.map(movie => ({
      ...movie,
      poster: typeof movie.poster === "string" && movie.poster.trim() !== "" ? movie.poster : "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg",
      trailer: typeof movie.trailer === "string" ? movie.trailer : "",
      title: movie.title || "Unknown Title",
      description: movie.description || "No description available",
      year: movie.year || "N/A",
      duration: movie.duration || "N/A",
      language: movie.language || "Unknown",
    }));

    console.log("Validated Movies:", validMovies);
    setMovies(validMovies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
    return url;
  }
};

const Recommendation = () => {
  // State hooks for managing movies and user actions
  const [movies, setMovies] = useState(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Fetch movies after a delay when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(setMovies);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Vanta.js background effect
  useEffect(() => {
    if (!vantaRef.current) return;
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
          color: 0xdb0000,
          backgroundColor: 0x000000,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Function to move to the next movie in the list
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  // Function to remove the current movie from recommendations
  const handleHide = () => {
    setMovies((prevMovies) => {
      const updatedMovies = prevMovies.filter((_, index) => index !== currentIndex);
      return updatedMovies;
    });
    setCurrentIndex((prevIndex) => (prevIndex >= movies.length - 1 ? 0 : prevIndex));
  };

  // Function to add a movie to the watch later list and move to the next movie
  const handleAccept = () => {
    if (movies.length > 0) {
      const currentMovie = movies[currentIndex];
      setWatchLaterList((prevList) => [...prevList, currentMovie]);
      handleNext();
    }
  };

  // If no movies are available, show a message
  if (movies.length === 0) {
    return (
      <div>
         <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -1 }}></div>
        <Navbar />
        <div className="no-recommendations">No more recommendations are available.</div>
      </div>
    );
  }

  // Get the current movie details
  const movie = movies[currentIndex] || {};
  const embedUrl = convertToEmbedUrl(movie.trailer || "");

  return (
    <div>
      <Navbar />
      {/* Vanta.js background effect */}
      <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -1 }}></div>
      <div className="recommendation-container">
        <div className="content-box fade-in">
          {/* Trailer Section */}
          <div className="trailer-container">
            <iframe className="trailer" src={embedUrl} title="YouTube trailer" frameBorder="0" allowFullScreen></iframe>
          </div>
          {/* Movie Details Section */}
          <div className="movie-card" style={{ paddingTop: "0px" }}>
            <div className="movie-title-info" style={{ paddingTop: "0px" }}>
              <h2 style={{ marginBottom: "5px" }}>{movie.title || "Unknown Title"}</h2>
              <p className="movie-info" style={{ textAlign: "left" }}>{movie.year || "Unknown Year"} • {movie.duration || "Unknown Duration"}</p>
            </div>
            <div className="movie-details">
              <div className="info-section">
                <p className="language"><strong>Language:</strong> {movie.language || "Unknown"}</p>
                <p className="description">{movie.description || "No description available."}</p>
              </div>
              <div className="poster-section">
                <img src={movie.poster || "placeholder.jpg"} alt={`${movie.title} Poster`} className="movie-poster" />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="button-container flex justify-center gap-6 mt-4">
              <button className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-red-600 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl" aria-label="Reject Recommendation" onClick={handleHide}>
                <span className="material-symbols-outlined text-4xl group-hover:text-white">close</span>
              </button>
              <button className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-green-500 hover:bg-green-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl" aria-label="Accept Recommendation" onClick={handleAccept}>
                <span className="material-symbols-outlined text-4xl group-hover:text-white">check</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;