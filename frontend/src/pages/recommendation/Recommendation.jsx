import React, { useState, useEffect, useRef } from "react";
import "./Recommendation.css";
import Navbar from "../../components/Navbar";

const initialMovies = [
  {
    title: "Krish Trish and Baltiboy: Face Your Fears",
    year: 2017,
    duration: "65 min",
    language: "Hindi, English",
    description:
      "In three tales about fear, a baby elephant gets captured by a circus, two boys enter a haunted house and a parrot faces his fear of flying.",
    trailer: "https://www.youtube.com/watch?v=bUmnmWt3W2A&pp=ygUxS3Jpc2ggVHJpc2ggYW5kIEJhbHRpYm95OiBGYWNlIFlvdXIgRmVhcnMgdHJhaWxlcg%3D%3D",
    poster: "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg",
  },
  {
    title: "My Own Man",
    year: 2015,
    duration: "82 min",
    language: "English",
    description:
      "When a man discovers he will be the father to a boy, his fear and insecurities send him on an emotional, humorous quest for his own manhood.",
    trailer: "https://www.youtube.com/watch?v=DKfiK-wCgFA&pp=ygUSTXkgT3duIE1hbiB0cmFpbGVy",
    poster: "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg",
  },
  {
    title: "9",
    year: 2009,
    duration: "80 min",
    language: "English",
    description:
      "In a postapocalyptic world, rag-doll robots hide in fear from dangerous machines out to exterminate them, until a brave newcomer joins the group.",
    trailer: "https://www.youtube.com/watch?v=_qApXdc1WPY&pp=ygUJOSB0cmFpbGVy",
    poster: "https://image.tmdb.org/t/p/w500//zASChgUKBSqlqjN7CnYVyzRVMT8.jpg",
  },
  {
    title: "Shattered Memories",
    year: 2018,
    duration: "86 min",
    language: "English",
    description:
      "When her former lover's mysteriously murdered, a woman must clear her name – and avoid the killer.",
    trailer: "https://www.youtube.com/watch?v=vFcoezCYOaQ&pp=ygUaU2hhdHRlcmVkIE1lbW9yaWVzIHRyYWlsZXI%3D",
    poster: "https://m.media-amazon.com/images/M/MV5BNGQyOTUwOTgtNGMzYy00OGUwLTk1NWMtZTIwNGEyNTRlNzQxXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_SX300.jpg",
  },
  {
    title: "Kahaani",
    year: 2012,
    duration: "122 min",
    language: "Hindi",
    description:
      "Pregnant and alone in the city of Kolkata, a woman begins a relentless search for her missing husband, only to find that nothing is what it seems.",
    trailer: "https://www.youtube.com/watch?v=rsjamVgPoI8&pp=ygUPS2FoYWFuaSB0cmFpbGVy",
    poster: "https://image.tmdb.org/t/p/w500//shsN1B7IPAQG1NLF6WVVi3X89lM.jpg",
  },
];

const Recommendation = () => {
  const [movies, setMovies] = useState(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchLaterList, setWatchLaterList] = useState([]); // Watch Later list

// Vanta.js background effect
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
        color: 0xdb0000, // Red color for the net effect
        backgroundColor: 0x000000, // Black background
      })
    );
  }

  return () => {
    if (vantaEffect) vantaEffect.destroy();
  };
}, [vantaEffect]);




  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handleHide = () => {
    setMovies((prevMovies) => prevMovies.filter((_, index) => index !== currentIndex));
    setCurrentIndex((prevIndex) => (prevIndex >= movies.length - 1 ? 0 : prevIndex));
  };

  const handleAccept = () => {
    const currentMovie = movies[currentIndex];
    setWatchLaterList((prevList) => [...prevList, currentMovie]); // Add to Watch Later list
    handleNext(); // Move to the next movie
  };

  if (movies.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="no-recommendations">
          No more recommendations are available.
        </div>
      </div>
    );
  }
  const movie = movies[currentIndex];

  return (
    <div>
      <Navbar />
      {/* Vanta.js Background */}
      <div
        ref={vantaRef}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      ></div>
      <div className="recommendation-container">
        <div className="content-box fade-in">
          {/* Trailer Section */}
          <div className="trailer-container">
            <iframe
              className="trailer"
              src={movie.trailer}
              title="YouTube trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          {/* Movie Info + Poster Section */}
          <div className="movie-card" style={{paddingTop: '0px'}}>
            <div className="movie-title-info" style={{ paddingTop: '0px' }}>
              <h2 style={{ marginBottom: '5px' }}>{movie.title}</h2>
              <p className="movie-info" style={{ textAlign: 'left' }}>
                {movie.year} • {movie.duration}
              </p>
            </div>
            <div className="movie-details">
              {/* Movie Info */}
              <div className="info-section">
                <p className="language">
                  <strong>Language:</strong> {movie.language}
                </p>
                <p className="description">{movie.description}</p>
              </div>

              {/* Movie Poster */}
              <div className="poster-section">
                <img src={movie.poster} alt={`${movie.title} Poster`} className="movie-poster" />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="button-container flex justify-center gap-6 mt-4">
              {/* Reject Button */}
              <button
                className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-red-600 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl"
                aria-label="Reject Recommendation"
                onClick={handleHide}
              >
                <span className="material-symbols-outlined text-4xl group-hover:text-white">
                  close
                </span>
              </button>

              {/* Accept Button */}
              <button
                className="group flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border-4 border-green-500 hover:bg-green-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-xl"
                aria-label="Accept Recommendation"
                onClick={handleAccept} // Use handleAccept instead of handleNext
              >
                <span className="material-symbols-outlined text-4xl group-hover:text-white">
                  check
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;