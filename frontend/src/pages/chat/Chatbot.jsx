import { useEffect, useRef, useState } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton, Chip, Stack, LinearProgress } from "@mui/material";
import { Send, ChevronRight, ArrowBack, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import MoodPage from "../../components/Mood";
import GenrePage from "../../components/Genre";
import LanguagePage from "../../components/Language";
import "./Chatbot.css"
// MoodPage Component - Optimized UI
const Chatbot = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [currentPage, setCurrentPage] = useState("mood"); // "mood", "genre", "language"
    const [mood, setMood] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!vantaEffect && window.VANTA) {
            setVantaEffect(
                window.VANTA.NET({
                    el: vantaRef.current,
                    mouseControls: true,
                    touchControls: true,
                    backgroundColor: 0x000000,
                    color: 0xdb0000,
                })
            );
        }
        return () => { if (vantaEffect) vantaEffect.destroy(); };
    }, [vantaEffect]);

    const handleMoodSelect = (selectedMood) => {
        setMood(selectedMood);
        setCurrentPage("genre");
    };

    const handleGenresSelect = (genres) => {
        setSelectedGenres(genres);
        setCurrentPage("language");
    };

    const handleBackToMood = () => {
        setCurrentPage("mood");
    };

    const handleBackToGenre = () => {
        setCurrentPage("genre");
    };

    // This function will be passed to LanguagePage to handle API calls and navigation
    const handleGetRecommendations = async (selectedLanguages) => {
        const userPreferences = {
            mood,
            genre: selectedGenres.join(", "),
            language: selectedLanguages.join(", "),
        };
    
        try {
            const response = await fetch("/api/preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPreferences),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Preferences sent successfully!");
                console.log("Response:", data);
                navigate("/recommendation");
            } else {
                alert("Error sending preferences: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            alert("Failed to connect to server!");
            console.error("API error:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: -1 }}></div>
            
            {currentPage === "mood" && (
                <MoodPage onMoodSelect={handleMoodSelect} vantaRef={vantaRef} />
            )}
            
            {currentPage === "genre" && (
                <GenrePage 
                    onGenresSelect={handleGenresSelect} 
                    onBack={handleBackToMood}
                    vantaRef={vantaRef} 
                />
            )}
            
            {currentPage === "language" && (
                <LanguagePage 
                    mood={mood} 
                    selectedGenres={selectedGenres}
                    onBack={handleBackToGenre}
                    onSubmit={handleGetRecommendations}
                    vantaRef={vantaRef} 
                />
            )}
        </>
    );
};

export default Chatbot;
