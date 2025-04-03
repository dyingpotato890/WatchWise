import React, { useState, useEffect, useRef } from "react";
import "./Recommendation.css";
import Navbar from "../../components/Navbar";
import NET from "vanta/dist/vanta.net.min";
import Loading from "../../components/Loading"; // ✅ Import Loading Page

// Initial empty movie list
const initialMovies = [];
// Move this outside of fetchMovies to make it accessible
const platformIcons = {
  "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Netflix_2015_N_logo.svg", // Just the N
  "Amazon Prime": "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg", // Full "Prime Video" 
  "Disney+": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", // Disney+ with plus
  "Hulu": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
  "HBO Max": "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
  "Apple TV+": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_TV_Plus_logo.svg"
};

// Function to fetch movies from the backend API
const fetchMovies = async (setMovies, setLoading) => {
  console.log("fetchMovies function called!");
  setLoading(true); // Start loading
  
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.warn("No access token found. User might not be logged in.");
      setLoading(false);
      return;
    }

    const response = await fetch("http://localhost:5010/api/movies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    console.log("API Response Status:", response.status);

    if (response.status === 401) {
      console.error("Unauthorized access. Token may be invalid or expired.");
      setLoading(false);
      return;
    }

    if (response.status === 204) {
      console.log("No recommendations found.");
      setLoading(false);
      return;
    }

    const data = await response.json();
    console.log("Raw Movies Data:", data);
    
  
    const validMovies = Array.isArray(data.movies) ? data.movies.map((movie) => ({  
      ...movie,
      poster: typeof movie.poster === "string" && movie.poster.trim() !== ""
        ? movie.poster
        : "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg",
      trailer: typeof movie.trailer === "string" ? movie.trailer : "",
      title: movie.title || "Unknown Title",
      description: movie.description || "No description available",
      year: movie.year || "N/A",
      duration: movie.duration || "N/A",
      language: movie.language || "Unknown",
      show_id: movie.show_id,
      source: movie.source || "Unknown" // Changed from available_on to source
    })) : [];
    

    console.log("Validated Movies:", validMovies);
    setMovies(validMovies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    setLoading(false); // Stop loading whether successful or not
  }
};


// Function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url) => {
  if (!url || typeof url !== "string" || url.trim() === "") {  // Added check for empty string
    return "https://www.youtube.com/embed/dQw4w9WgXcQ";
  }

  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
    return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Fallback video
  }
};

const Recommendation = () => {
  // State hooks for managing movies and user actions
  const [movies, setMovies] = useState(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [watchLaterList, setWatchLaterList] = useState([]);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [processedIds, setProcessedIds] = useState(new Set());

  // Fetch movies after a delay when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(setMovies, setLoading); // Pass setLoading to fetchMovies
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
    
  // Initialize Vanta.js background effect
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current, // Attach to div
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xdb0000, // Red effect
          backgroundColor: 0x000000, // Black background
        })
      );
    }
  
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy(); // Cleanup on unmount
        setVantaEffect(null); // Reset effect
      }
    };
  }, []); // ✅ Empty dependency array to run only once
  
  
  
  // Function to move to the next movie in the list
  const handleNext = () => {
    if (movies.length === 0) return;  
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % movies.length;
      return nextIndex === currentIndex ? prevIndex : nextIndex;
    });
  };

  const handleHide = async () => {
    if (movies.length === 0 || !movies[currentIndex]?.show_id) return; 
    if (movies.length > 0) {
      const currentMovie = movies[currentIndex];
      if (!processedIds.has(currentMovie.show_id)) {
        setProcessedIds(prev => new Set(prev).add(currentMovie.show_id));
        setMovies(prevMovies => prevMovies.filter(movie => movie.show_id !== currentMovie.show_id));
      }
      handleNext();
    }
  };

  const handleAccept = async () => {
    if (movies.length === 0 || !movies[currentIndex]?.show_id) return; 
    if (movies.length > 0) {
      const currentMovie = movies[currentIndex];
      
      if (processedIds.has(currentMovie.show_id)) {
        handleNext();
        return;
      }

      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found, user not authenticated.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5010/api/watchlater", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            show_id: currentMovie.show_id,
            title: currentMovie.title,
          }),
        });

        if (!response.ok) {
          console.error("Failed to add movie to watch later:", response.status);
        } else {
          console.log("Movie added to watch later successfully!");
          setProcessedIds(prev => new Set(prev).add(currentMovie.show_id));
        }
      } catch (error) {
        console.error("Error adding movie to watch later:", error);
      }

      handleNext();
    }
  };

 
// Replace your current conditional return with:
if (loading) {
  return (
    <div className="loading-app-container">
      <Navbar />
      <div ref={vantaRef} className="vanta-background"></div>
      <div className="vanta-overlay"></div>
      <Loading />
    </div>
  );
}

if (!loading && movies.length === 0) {
  return (
    <div className="loading-app-container">
      <Navbar />
      <div ref={vantaRef} className="vanta-background"></div>
      <div className="no-recommendations">
        No recommendations are available. 
      </div>
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
      <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -10 }}></div>
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

                {/* Updated Available On Section */}
                {movie.source && (
                  <div className="available-on">
                    <p><strong>Available on:</strong></p>
                    <div className="platform-icons-row">
                      {(() => {
                        const platform = movie.source;
                        const iconUrl = platformIcons[platform];
                        return iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={platform}
                            className={`platform-icon ${platform.toLowerCase().replace('+', 'plus')}`}
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.style.display = 'none';
                              // Optional: Insert text fallback
                              const textNode = document.createTextNode(platform);
                              e.target.parentNode.appendChild(textNode);
                            }}
                          />
                        ) : (
                          <span className="platform-name">{platform}</span>
                        );
                      })()}
                    </div>
                  </div>
                )}
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