import React, { useEffect, useRef, useState } from "react";
import "./Recommendation.css"; // Import the CSS file
import Navbar from "../../components/Navbar";

const Recommendation = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


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
          color: 0xdb0000, // Red color for the net effect
          backgroundColor: 0x000000, // Black background
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.movies))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleReject = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleAccept = () => {
    if (movies.length > 0) {
      const selectedMovie = movies[currentIndex];
      fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ show_id: selectedMovie.show_id }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Added to watch later:", data))
        .catch((error) => console.error("Error adding to watch later:", error));
    }
  };

  if (movies.length === 0 || currentIndex >= movies.length) {
    return <div className="recommendation-page text-white text-center">No more recommendations</div>;
  }

  const currentMovie = movies[currentIndex];


  return (
    <div className="recommendation-page">
      {/* Vanta.js Background */}
      <div
        ref={vantaRef}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: -1, // Ensure it stays in the background
        }}
      ></div>
      <Navbar /> {/* Navbar remains fixed on top */}

      {/* Container to push content below navbar */}
      <div className="recommendation-container flex flex-col items-center min-h-screen">
        <div className="recommendation-content w-full md:w-[800px] mx-auto bg-black text-white font-sans">
          {/* Main Content */}
          <main className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2 text-center">Your Recommendations</h1>

            {/* Trailer */}
            <div className="trailer-container w-full">
              <iframe
                className="w-full max-w-[800px] h-[300px] sm:h-[350px] md:h-[400px]"
                src={currentMovie.trailer}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Poster and Description */}
            <div className="movie-card flex flex-col md:flex-row items-center mt-4">
              {/* Poster */}
              <img
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="movie-image w-40 md:w-52 lg:w-64"
              />

              {/* Movie Details */}
              <div className="movie-details text-center md:text-left md:ml-6">
                <h3 className="movie-title text-xl font-bold text-red-500">{currentMovie.title}</h3>
                <div className="movie-info">
                  {/* Language Section */}
                  <div className="info-section">
                    <h4 className="info-heading">Language</h4>
                    <div className="info-content">{currentMovie.language}</div>
                  </div>

                  {/* Description Section */}
                  <div className="info-section">
                    <h4 className="info-heading">Movie Description</h4>
                    <div className="description-container">
                      <p className="text-gray-200 text-base leading-relaxed">
                        {currentMovie.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons - Adjusted position */}
            <div className="button-container flex justify-center gap-6 mt-4">
              <button
                className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-red-600 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl"
                aria-label="Reject Recommendation"
                onClick={handleReject}
              >
                <span className="material-symbols-outlined text-4xl group-hover:text-white">close</span>
              </button>
              <button
                className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-green-500 hover:bg-green-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl"
                aria-label="Accept Recommendation"
                onClick={handleAccept}
              >
                <span className="material-symbols-outlined text-4xl group-hover:text-white">check</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;