import React, { useEffect, useRef } from "react";
import "./Loading.css";
import NET from "vanta/dist/vanta.net.min";
import Navbar from "./Navbar";

const Loading = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = React.useState(null);

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
    <div className="loading-wrapper" ref={vantaRef}>
       <div className="vanta-overlay"></div>
      <Navbar />
      
      <div className="loading-content">
        <div className="logo-container">
          <h1 className="logo-text">
            <span className="logo-letter">W</span>
            <span className="logo-letter">A</span>
            <span className="logo-letter">T</span>
            <span className="logo-letter">C</span>
            <span className="logo-letter">H</span>
            <span className="logo-letter">W</span>
            <span className="logo-letter">I</span>
            <span className="logo-letter">S</span>
            <span className="logo-letter">E</span>
          </h1>
        </div>

        <div className="loading-animation">
          <div className="border-left"></div>
          <div className="border-right"></div>
          <div className="border-top"></div>
          <div className="border-bottom"></div>

          {/* Thinner spinning circle (4px instead of 8px) */}
          <div className="spinning-circle"></div>

          <div className="loading-animation-container">
          <div className="loading-animation">
            <div className="broken-circle-spinner">
              <div className="spinner-arc arc-1"></div>
              <div className="spinner-arc arc-2"></div>
            </div>
            <div className="loading-letters">
              <span className="letter delay-100">L</span>
              <span className="letter delay-200">O</span>
              <span className="letter delay-300">A</span>
              <span className="letter delay-400">D</span>
              <span className="letter delay-500">I</span>
              <span className="letter delay-600">N</span>
              <span className="letter delay-700">G</span>
            </div>
          </div>
        </div>

        </div>

        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>

        <p className="loading-text">Finding the perfect movie for your mood...</p>
      </div>
    </div>
  );
};

export default Loading;