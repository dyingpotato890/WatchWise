import { useEffect, useRef, useState } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton, Chip, Stack, LinearProgress } from "@mui/material";
import { Send, ChevronRight, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Chatbot.css";

// MoodPage Component
const MoodPage = ({ onMoodSelect, vantaRef }) => {
    const [messages, setMessages] = useState([{ text: "Describe how you're feeling or select a mood below:", sender: "bot" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Predefined moods
    const predefinedMoods = ["Happy", "Sad", "Excited", "Relaxed", "Bored", "Nostalgic"];

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5010/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: input })
            });
            const data = await response.json();

            if (data.mood) {
                setMessages((prev) => [
                    ...prev,
                    { text: `Mood detected: ${data.mood}`, sender: "bot" },
                    { text: "Click 'Continue' to proceed to genre selection", sender: "bot" }
                ]);
                setTimeout(() => onMoodSelect(data.mood), 1000);
            } else {
                setMessages((prev) => [...prev, { text: "Couldn't determine mood. Please describe again or select from the buttons below.", sender: "bot" }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Error connecting to server!", sender: "bot" }]);
        }
        
        setLoading(false);
        setInput("");
    };

    return (
        <>
            <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                <Paper 
                    elevation={10} 
                    style={{ 
                        padding: "2rem", 
                        backgroundColor: "rgba(0,0,0,0.65)", 
                        color: "white", 
                        borderRadius: "12px", 
                        width: "90%", 
                        height: "500px", 
                        display: "flex", 
                        flexDirection: "column",
                        border: "1px solid rgba(255,77,77,0.3)",
                        boxShadow: "0 4px 20px rgba(255,77,77,0.15)"
                    }}
                >
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1, fontWeight: "bold", color: "#ff4d4d" }}>
                                Step 1: Select Your Mood
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={33} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#a52929',
                                }
                            }} 
                        />
                    </Box>
                    
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            overflowY: "auto", 
                            padding: "1rem", 
                            display: "flex", 
                            flexDirection: "column",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            mb: 2
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                                <Typography 
                                    sx={{ 
                                        maxWidth: "70%", 
                                        padding: "12px", 
                                        borderRadius: "12px", 
                                        backgroundColor: msg.sender === "user" ? "rgba(255,77,77,0.3)" : "rgba(255,255,255,0.1)", 
                                        color: msg.sender === "user" ? "#ff4d4d" : "#ffffff",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                        border: msg.sender === "user" ? "1px solid rgba(255,77,77,0.5)" : "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    {msg.text}
                                </Typography>
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "flex-start", marginBottom: "8px" }}>
                                <Typography 
                                    sx={{ 
                                        padding: "12px", 
                                        borderRadius: "12px", 
                                        backgroundColor: "rgba(255,255,255,0.1)", 
                                        color: "#ffffff"
                                    }}
                                >
                                    Analyzing mood...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium", textAlign: "center" }}>
                        Choose your mood:
                    </Typography>
                    
                    <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, mb: 2 }}>
                        {predefinedMoods.map((mood) => (
                            <Button 
                                key={mood} 
                                onClick={() => {
                                    setMessages((prev) => [
                                        ...prev,
                                        { text: mood, sender: "user" },
                                        { text: `You selected: ${mood}`, sender: "bot" },
                                        { text: "Click 'Continue' to proceed to genre selection", sender: "bot" }
                                    ]);
                                    setTimeout(() => onMoodSelect(mood), 1000);
                                }}
                                sx={{
                                    backgroundColor: "#a52929",
                                    color: "white",
                                    padding: "12px 8px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                    transition: "all 0.2s ease",
                                    "&:hover": { 
                                        backgroundColor: "#881818", 
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 12px rgba(0,0,0,0.4)"
                                    },
                                }}
                            >
                                {mood}
                            </Button>
                        ))}
                    </Box>
                    
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        gap={1}
                        sx={{
                            backgroundColor: "rgba(0,0,0,0.3)",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        <TextField 
                            fullWidth 
                            variant="outlined" 
                            placeholder="Describe your mood..." 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyDown={(e) => { 
                                if (e.key === "Enter" && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    handleSendMessage(); 
                                } 
                            }}
                            sx={{
                                input: { color: "white" },
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    "&:hover fieldset": {
                                        borderColor: "rgba(255,77,77,0.5)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ff4d4d",
                                    },
                                },
                            }} 
                        />
                        <IconButton 
                            onClick={handleSendMessage} 
                            style={{ 
                                backgroundColor: "#a52929", 
                                color: "white",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                            }}
                        >
                            <Send />
                        </IconButton>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

// GenrePage Component
const GenrePage = ({ onGenresSelect, onBack, vantaRef }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    
    // Extended list of 20 genres
    const genres = [
        "Action & Adventure", "Romantic", "Comedy", "Horror", "Thrillers", 
        "Drama", "Science Fiction", "Fantasy", "Documentary", "Animation",
        "Crime", "Mystery", "Western", "Musical", "Historical",
        "War", "Biography", "Family", "Sports", "Superhero"
    ];

    const handleGenreToggle = (genre) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre) 
                : [...prev, genre]
        );
    };

    return (
        <>
            <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                <Paper 
                    elevation={10} 
                    style={{ 
                        padding: "2rem", 
                        backgroundColor: "rgba(0,0,0,0.65)", 
                        color: "white", 
                        borderRadius: "12px", 
                        width: "90%", 
                        height: "500px", 
                        display: "flex", 
                        flexDirection: "column",
                        border: "1px solid rgba(255,77,77,0.3)",
                        boxShadow: "0 4px 20px rgba(255,77,77,0.15)"
                    }}
                >
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconButton 
                                onClick={onBack} 
                                sx={{ 
                                    color: "#ff4d4d", 
                                    mr: 1,
                                    "&:hover": { 
                                        backgroundColor: "rgba(255,77,77,0.1)"
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1, fontWeight: "bold", color: "#ff4d4d" }}>
                                Step 2: Select Your Genres
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={66} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#a52929',
                                }
                            }} 
                        />
                    </Box>
                    
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            overflowY: "auto", 
                            padding: "1rem",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium", textAlign: "center" }}>
                            Select one or more genres below, or none if you prefer:
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, justifyContent: "center" }}>
                            {genres.map((genre) => (
                                <Chip
                                    key={genre}
                                    label={genre}
                                    onClick={() => handleGenreToggle(genre)}
                                    color={selectedGenres.includes(genre) ? "error" : "default"}
                                    variant={selectedGenres.includes(genre) ? "filled" : "outlined"}
                                    sx={{ 
                                        margin: "6px", 
                                        padding: "18px 8px",
                                        bgcolor: selectedGenres.includes(genre) ? "#a52929" : "rgba(0,0,0,0.5)",
                                        color: "white",
                                        border: "1px solid #a52929",
                                        fontWeight: selectedGenres.includes(genre) ? "bold" : "normal",
                                        boxShadow: selectedGenres.includes(genre) ? "0 2px 8px rgba(255,77,77,0.4)" : "0 1px 3px rgba(0,0,0,0.3)",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            bgcolor: selectedGenres.includes(genre) ? "#881818" : "rgba(255,77,77,0.1)",
                                            transform: "translateY(-2px)",
                                            boxShadow: selectedGenres.includes(genre) ? "0 4px 12px rgba(255,77,77,0.4)" : "0 3px 10px rgba(0,0,0,0.2)"
                                        }
                                    }}
                                />
                            ))}
                        </Stack>

                        <Box 
                            sx={{ 
                                display: "flex", 
                                justifyContent: "center", 
                                my: 2, 
                                py: 2, 
                                border: "1px dashed rgba(255,77,77,0.5)",
                                borderRadius: "8px",
                                backgroundColor: "rgba(255,77,77,0.05)"
                            }}
                        >
                            <Typography variant="body1" fontWeight="medium">
                                {selectedGenres.length === 0 
                                    ? "No genres selected" 
                                    : `Selected genres (${selectedGenres.length}): ${selectedGenres.join(", ")}`}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button 
                            variant="contained" 
                            endIcon={<ChevronRight />}
                            onClick={() => onGenresSelect(selectedGenres)}
                            sx={{
                                backgroundColor: "#a52929",
                                color: "white",
                                padding: "12px 24px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                                transition: "all 0.2s ease",
                                "&:hover": { 
                                    backgroundColor: "#881818",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 12px rgba(0,0,0,0.5)"
                                },
                            }}
                        >
                            Continue to Language Selection
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

// LanguagePage Component
const LanguagePage = ({ mood, selectedGenres, onBack, vantaRef }) => {
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const languages = ["English", "Thai", "Korean", "Japanese", "Spanish", "French", "German", "Italian", "Chinese", "Russian"];

    const handleLanguageToggle = (language) => {
        setSelectedLanguages(prev => 
            prev.includes(language) 
                ? prev.filter(l => l !== language) 
                : [...prev, language]
        );
    };

    const handleGetRecommendations = async () => {
        setIsLoading(true);
        
        const userPreferences = {
            mood,
            genre: selectedGenres.join(", "),
            language: selectedLanguages.join(", "),
        };

        console.log(userPreferences)
    
        try {
            const response = await fetch("http://localhost:5010/api/preference", {
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
                setIsLoading(false);
            }
        } catch (error) {
            alert("Failed to connect to server!");
            console.error("API error:", error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                <Paper 
                    elevation={10} 
                    style={{ 
                        padding: "2rem", 
                        backgroundColor: "rgba(0,0,0,0.65)", 
                        color: "white", 
                        borderRadius: "12px", 
                        width: "90%", 
                        height: "500px", 
                        display: "flex", 
                        flexDirection: "column",
                        border: "1px solid rgba(255,77,77,0.3)",
                        boxShadow: "0 4px 20px rgba(255,77,77,0.15)"
                    }}
                >
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconButton 
                                onClick={onBack} 
                                sx={{ 
                                    color: "#ff4d4d", 
                                    mr: 1,
                                    "&:hover": { 
                                        backgroundColor: "rgba(255,77,77,0.1)"
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1, fontWeight: "bold", color: "#ff4d4d" }}>
                                Step 3: Select Your Languages
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={100} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#a52929',
                                }
                            }} 
                        />
                    </Box>
                    
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            overflowY: "auto", 
                            padding: "1rem",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium", textAlign: "center" }}>
                            Select one or more languages below, or none if you prefer:
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, justifyContent: "center" }}>
                            {languages.map((language) => (
                                <Chip
                                    key={language}
                                    label={language}
                                    onClick={() => handleLanguageToggle(language)}
                                    color={selectedLanguages.includes(language) ? "error" : "default"}
                                    variant={selectedLanguages.includes(language) ? "filled" : "outlined"}
                                    sx={{ 
                                        margin: "6px", 
                                        padding: "18px 8px",
                                        bgcolor: selectedLanguages.includes(language) ? "#a52929" : "rgba(0,0,0,0.5)",
                                        color: "white",
                                        border: "1px solid #a52929",
                                        fontWeight: selectedLanguages.includes(language) ? "bold" : "normal",
                                        boxShadow: selectedLanguages.includes(language) ? "0 2px 8px rgba(255,77,77,0.4)" : "0 1px 3px rgba(0,0,0,0.3)",
                                        transition: "all 0.2s ease",
                                        '&:hover': {
                                            bgcolor: selectedLanguages.includes(language) ? "#881818" : "rgba(255,77,77,0.1)",
                                            transform: "translateY(-2px)",
                                            boxShadow: selectedLanguages.includes(language) ? "0 4px 12px rgba(255,77,77,0.4)" : "0 3px 10px rgba(0,0,0,0.2)"
                                        }
                                    }}
                                />
                            ))}
                        </Stack>

                        <Box 
                            sx={{ 
                                mt: 3, 
                                padding: "20px", 
                                border: "1px solid rgba(255,77,77,0.5)", 
                                borderRadius: "8px", 
                                width: "100%", 
                                maxWidth: "600px", 
                                margin: "0 auto",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, color: "#ff4d4d", fontWeight: "bold", textAlign: "center" }}>
                                Summary of Selections
                            </Typography>
                            
                            <Box sx={{ 
                                display: "grid", 
                                gridTemplateColumns: "100px 1fr", 
                                gap: 2,
                                "& > .MuiTypography-root": {
                                    mb: 1
                                }
                            }}>
                                <Typography variant="body1" fontWeight="bold">Mood:</Typography>
                                <Typography variant="body1">{mood}</Typography>
                                
                                <Typography variant="body1" fontWeight="bold">Genres:</Typography>
                                <Typography variant="body1">
                                    {selectedGenres.length > 0 ? selectedGenres.join(", ") : "None"}
                                </Typography>
                                
                                <Typography variant="body1" fontWeight="bold">Languages:</Typography>
                                <Typography variant="body1">
                                    {selectedLanguages.length > 0 ? selectedLanguages.join(", ") : "None"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button 
                            variant="contained" 
                            onClick={handleGetRecommendations}
                            disabled={isLoading}
                            sx={{
                                backgroundColor: "#a52929",
                                color: "white",
                                padding: "12px 30px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                                transition: "all 0.2s ease",
                                "&:hover": { 
                                    backgroundColor: "#881818",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 12px rgba(0,0,0,0.5)"
                                },
                                "&:disabled": {
                                    backgroundColor: "#6b1a1a",
                                    color: "rgba(255,255,255,0.7)"
                                }
                            }}
                        >
                            {isLoading ? "Loading..." : "Get Recommendations"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

// Main Chatbot Component
const Chatbot = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [currentPage, setCurrentPage] = useState("mood"); // "mood", "genre", "language"
    const [mood, setMood] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);

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
                    vantaRef={vantaRef} 
                />
            )}
        </>
    );
};

export default Chatbot;