import { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton, Chip, LinearProgress } from "@mui/material";
import { Send, Check } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "../pages/chat/Chatbot.css";

const MoodPage = ({ onMoodSelect }) => {
    const [messages, setMessages] = useState([{ text: "Describe how you're feeling or select a mood below:", sender: "bot" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    // Predefined moods
    const predefinedMoods = [
        "Anger", "Annoyed", "Curious", "Disgust", "Excited", "Fear", "Joy", 
        "Lonely", "Relaxed", "Romantic", "Sadness", "Scared", "Surprise", "Tense"
    ];

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: input })
            });
            const data = await response.json();

            if (data.mood) {
                setSelectedMood(data.mood);
                setShowConfirmation(true);
                setMessages((prev) => [
                    ...prev,
                    { text: `Mood detected: ${data.mood}`, sender: "bot" },
                    { text: "Is this correct? If not, please describe your mood again or select from the options below.", sender: "bot" }
                ]);
            } else {
                setMessages((prev) => [...prev, { text: "Couldn't determine mood. Please describe again or select from the options below.", sender: "bot" }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Error connecting to server!", sender: "bot" }]);
        }
        
        setLoading(false);
        setInput("");
    };

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood);
        setShowConfirmation(true);
        setMessages((prev) => [
            ...prev,
            { text: mood, sender: "user" },
            { text: `You selected: ${mood}`, sender: "bot" },
            { text: "Is this correct? Click 'Confirm Mood' to proceed or select another mood if you'd like to change.", sender: "bot" }
        ]);
    };

    const handleConfirmMood = () => {
        if (selectedMood) {
            setMessages((prev) => [
                ...prev,
                { text: `Mood confirmed: ${selectedMood}. Proceeding to genre selection.`, sender: "bot" }
            ]);
            // Delay moving to next page to let the user see the confirmation message
            setTimeout(() => onMoodSelect(selectedMood), 1000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Paper 
                        elevation={10} 
                        style={{ 
                            padding: "1.5rem", 
                            backgroundColor: "rgba(0,0,0,0.65)", 
                            color: "white", 
                            borderRadius: "12px", 
                            width: "90%", 
                            minWidth: "800px",
                            height: "500px", 
                            display: "flex", 
                            flexDirection: "column",
                            border: "1px solid rgba(255,77,77,0.3)",
                            boxShadow: "0 4px 20px rgba(255,77,77,0.15)"
                        }}
                    >
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        ease: "easeOut",
                                        yoyo: Infinity,
                                        repeatDelay: 5
                                    }}
                                >
                                    <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1, fontWeight: "bold", color: "#ff4d4d" }}>
                                        Step 1: Select Your Mood
                                    </Typography>
                                </motion.div>
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
                                padding: "0.75rem", 
                                display: "flex", 
                                flexDirection: "column",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                mb: 1.5
                            }}
                        >
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                                            <Typography 
                                                sx={{ 
                                                    maxWidth: "70%", 
                                                    padding: "8px 12px", 
                                                    borderRadius: "12px", 
                                                    backgroundColor: msg.sender === "user" ? "rgba(255,77,77,0.3)" : "rgba(255,255,255,0.1)", 
                                                    color: msg.sender === "user" ? "#ff4d4d" : "#ffffff",
                                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                                    border: msg.sender === "user" ? "1px solid rgba(255,77,77,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                                    fontSize: "0.9rem"
                                                }}
                                            >
                                                {msg.text}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", marginBottom: "8px" }}>
                                        <Typography 
                                            sx={{ 
                                                padding: "8px 12px", 
                                                borderRadius: "12px", 
                                                backgroundColor: "rgba(255,255,255,0.1)", 
                                                color: "#ffffff",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            Analyzing mood...
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )}
                        </Box>
                        
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium", textAlign: "center" }}>
                            Choose your mood:
                        </Typography>

                        <Box 
                            sx={{ 
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2,
                                padding: "0.75rem",
                                backgroundColor: "rgba(0,0,0,0.2)",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            {/* First row of moods */}
                            <Box 
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: 1.5,
                                    width: "100%"
                                }}
                            >
                                {predefinedMoods.slice(0, 7).map((mood, index) => (
                                    <motion.div
                                        key={mood}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <Chip 
                                            label={mood}
                                            onClick={() => handleMoodSelection(mood)}
                                            sx={{
                                                backgroundColor: selectedMood === mood ? "#881818" : "#a52929",
                                                color: "white",
                                                padding: "8px 4px",
                                                minWidth: "85px",
                                                height: "32px",
                                                borderRadius: "16px",
                                                fontWeight: selectedMood === mood ? "bold" : "normal",
                                                transition: "all 0.3s ease",
                                                boxShadow: selectedMood === mood ? "0 3px 5px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.2)",
                                                "&:hover": { 
                                                    backgroundColor: "#881818"
                                                },
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </Box>
                            
                            {/* Second row of moods */}
                            <Box 
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: 1.5,
                                    width: "100%"
                                }}
                            >
                                {predefinedMoods.slice(7).map((mood, index) => (
                                    <motion.div
                                        key={mood}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <Chip 
                                            label={mood}
                                            onClick={() => handleMoodSelection(mood)}
                                            sx={{
                                                backgroundColor: selectedMood === mood ? "#881818" : "#a52929",
                                                color: "white",
                                                padding: "8px 4px",
                                                minWidth: "85px",
                                                height: "32px",
                                                borderRadius: "16px",
                                                fontWeight: selectedMood === mood ? "bold" : "normal",
                                                transition: "all 0.3s ease",
                                                boxShadow: selectedMood === mood ? "0 3px 5px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.2)",
                                                "&:hover": { 
                                                    backgroundColor: "#881818"
                                                },
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </Box>
                        </Box>
                        
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                            sx={{
                                backgroundColor: "rgba(0,0,0,0.3)",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                mb: showConfirmation ? 1 : 0
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
                                size="small"
                                sx={{
                                    input: { color: "white", fontSize: "0.9rem" },
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
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <IconButton 
                                    onClick={handleSendMessage} 
                                    size="small"
                                    style={{ 
                                        backgroundColor: "#a52929", 
                                        color: "white",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    <Send fontSize="small" />
                                </IconButton>
                            </motion.div>
                        </Box>
                        
                        <AnimatePresence>
                            {showConfirmation && selectedMood && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                variant="contained" 
                                                startIcon={<Check />}
                                                onClick={handleConfirmMood}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "rgba(255,77,77,0.5)",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    fontSize: "0.9rem",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": { 
                                                        backgroundColor: "rgba(157, 50, 50, 0.5)"
                                                    },
                                                }}
                                            >
                                                Confirm Mood: {selectedMood}
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Paper>
                </motion.div>
            </Container>
        </motion.div>
    );
};

export default MoodPage;
