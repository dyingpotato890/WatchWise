import { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton, Chip, Stack, LinearProgress } from "@mui/material";
import { Send, ChevronRight, ArrowBack, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LanguagePage = ({ mood, selectedGenres, onBack }) => {
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(false);
    
    const languages = [
        "Arabic", "English", "French", "German", "Hindi", "Italian", 
        "Japanese", "Korean", "Malayalam", "Mandarin", "Russian", "Spanish", "Thai"
    ];

    useEffect(() => {
        // Trigger entry animation when component mounts
        setIsPageVisible(true);
    }, []);

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
    
        try {
            const response = await fetch("http://localhost:5010/api/preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPreferences),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Exit animation before navigation
                setIsPageVisible(false);
                // Wait for exit animation to complete
                setTimeout(() => {
                    navigate("/recommendation");
                }, 500);
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

    const handleBackWithAnimation = () => {
        setIsPageVisible(false);
        setTimeout(() => {
            onBack();
        }, 300);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            y: -50,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const chipVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 300 }
        },
        tap: { scale: 0.95 },
        hover: { 
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(255,77,77,0.4)",
            transition: { type: "spring", stiffness: 400 }
        },
        selected: {
            scale: 1.05,
            backgroundColor: "#881818",
            boxShadow: "0 4px 12px rgba(255,77,77,0.4)",
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isPageVisible && (
                <motion.div
                    key="language-page"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                        <Paper 
                            component={motion.div}
                            variants={itemVariants}
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
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <IconButton 
                                            onClick={handleBackWithAnimation} 
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
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        style={{ flexGrow: 1 }}
                                    >
                                        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", color: "#ff4d4d" }}>
                                            Step 3: Select Your Languages
                                        </Typography>
                                    </motion.div>
                                </Box>
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
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
                                </motion.div>
                            </Box>
                            
                            <Box 
                                component={motion.div}
                                variants={itemVariants}
                                sx={{ 
                                    flexGrow: 1, 
                                    overflowY: "auto", 
                                    padding: "1rem",
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium", textAlign: "center" }}>
                                        Select one or more languages below, or none if you prefer:
                                    </Typography>
                                </motion.div>
                                
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, justifyContent: "center" }}>
                                    {languages.map((language, index) => (
                                        <motion.div
                                            key={language}
                                            variants={chipVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            whileTap="tap"
                                            custom={index}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <Chip
                                                label={language}
                                                onClick={() => handleLanguageToggle(language)}
                                                sx={{ 
                                                    margin: "6px", 
                                                    padding: "18px 8px",
                                                    bgcolor: selectedLanguages.includes(language) ? "#a52929" : "rgba(0,0,0,0.5)",
                                                    color: "white",
                                                    border: "1px solid #a52929",
                                                    fontWeight: selectedLanguages.includes(language) ? "bold" : "normal",
                                                    transition: "all 0.2s ease",
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </Stack>

                                <motion.div
                                    variants={itemVariants}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
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
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <Typography variant="body1" fontWeight="bold">Mood:</Typography>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <Typography variant="body1">{mood}</Typography>
                                            </motion.div>
                                            
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <Typography variant="body1" fontWeight="bold">Genres:</Typography>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <Typography variant="body1">
                                                    {selectedGenres.length > 0 ? selectedGenres.join(", ") : "None"}
                                                </Typography>
                                            </motion.div>
                                            
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <Typography variant="body1" fontWeight="bold">Languages:</Typography>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <Typography variant="body1">
                                                    {selectedLanguages.length > 0 ? selectedLanguages.join(", ") : "None"}
                                                </Typography>
                                            </motion.div>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                            
                            <Box display="flex" justifyContent="center" mt={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
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
                                                boxShadow: "0 6px 12px rgba(0,0,0,0.5)"
                                            },
                                            "&:disabled": {
                                                backgroundColor: "#6b1a1a",
                                                color: "rgba(255,255,255,0.7)"
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                style={{ display: "inline-block", marginRight: "8px" }}
                                            >
                                                ⭮
                                            </motion.div>
                                        ) : null}
                                        {isLoading ? "Loading..." : "Get Recommendations"}
                                    </Button>
                                </motion.div>
                            </Box>
                        </Paper>
                    </Container>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LanguagePage;