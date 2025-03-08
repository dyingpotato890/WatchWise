import { useEffect, useRef, useState } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import "./Chatbot.css";

const Chatbot = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [mood, setMood] = useState(null);
    const [moodConfirmed, setMoodConfirmed] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [awaitingGenre, setAwaitingGenre] = useState(false);
    const [awaitingLanguage, setAwaitingLanguage] = useState(false);

    const genres = ["Action", "Romance", "Comedy", "Horror", "Drama"];
    const languages = ["English", "Thai", "Korean", "Japanese", "Spanish"];

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

    const handleGenreSelection = (genre) => {
        setSelectedGenre(genre);
        setAwaitingGenre(false);
        setAwaitingLanguage(true);
        setMessages((prev) => [
            ...prev,
            { text: `Genre: ${genre}`, sender: "bot" },
            { text: "Choose your language:", sender: "bot" }
        ]);
    };
    
    const handleLanguageSelection = (language) => {
        setSelectedLanguage(language);
        setAwaitingLanguage(false);
        setMessages((prev) => [
            ...prev,
            { text: `Language: ${language}`, sender: "bot" },
            { text: `Mood: ${mood}\nGenre: ${selectedGenre}\nLanguage: ${language}\nPress 'End' if done.`, sender: "bot" }
        ]);
    };

    const handleEndChat = async () => {
        if (!mood || !selectedGenre || !selectedLanguage) {
            alert("Please complete the selection before ending the chat.");
            return;
        }
    
        const userPreferences = {
            mood,
            genre: selectedGenre,
            language: selectedLanguage,
        };
    
        try {
            const response = await fetch("http://localhost:5010/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPreferences),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Preferences sent successfully!");
                console.log("Response:", data);
            } else {
                alert("Error sending preferences: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            alert("Failed to connect to server!");
            console.error("API error:", error);
        }
    };
    

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        if (mood && !moodConfirmed) {
            if (input.toLowerCase() === "yes") {
                setMoodConfirmed(true);
                setAwaitingGenre(true);
                setMessages((prev) => [...prev, { text: "Choose your genre:", sender: "bot" }]);
            } else {
                setMessages((prev) => [...prev, { text: "Please type 'yes' to confirm your mood.", sender: "bot" }]);
            }
            setInput("");
            return;
        }

        if (awaitingGenre) {
            if (genres.includes(input)) {
                setSelectedGenre(input);
                setAwaitingGenre(false);
                setAwaitingLanguage(true);
                setMessages((prev) => [...prev, { text: "Choose your language:", sender: "bot" }]);
            } else {
                setMessages((prev) => [...prev, { text: "Invalid genre. Please choose from: " + genres.join(", "), sender: "bot" }]);
            }
            setInput("");
            return;
        }

        if (awaitingLanguage) {
            if (languages.includes(input)) {
                setSelectedLanguage(input);
                setAwaitingLanguage(false);
                setMessages((prev) => [
                    ...prev,
                    { text: `Mood: ${mood}\nGenre: ${selectedGenre}\nLanguage: ${input}\nPress 'End' if done.`, sender: "bot" }
                ]);
            } else {
                setMessages((prev) => [...prev, { text: "Invalid language. Please choose from: " + languages.join(", "), sender: "bot" }]);
            }
            setInput("");
            return;
        }

        if (!mood) {
            try {
                const response = await fetch("http://localhost:5010/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_input: input })
                });
                const data = await response.json();

                if (data.mood) {
                    setMood(data.mood);
                    setMessages((prev) => [
                        ...prev,
                        { text: `Mood: ${data.mood}`, sender: "bot" },
                        { text: "Is this correct? Type 'yes' to proceed.", sender: "bot" }
                    ]);
                } else {
                    setMessages((prev) => [...prev, { text: "Couldn't determine mood. Please describe again.", sender: "bot" }]);
                }
            } catch (error) {
                setMessages((prev) => [...prev, { text: "Error connecting to server!", sender: "bot" }]);
            }
        }

        setInput("");
    };

    useEffect(() => {
        setMessages([{ text: "Describe how you're feeling.", sender: "bot" }]);
    }, []);

    return (
        <>
            <Navbar />
            <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: -1 }}></div>
            <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", height: "600px", marginTop: "130px" }}>
                <Paper elevation={10} className="chat-window" style={{ padding: "2rem", backgroundColor: "rgba(0,0,0,0.29)", color: "white", borderRadius: "12px", width: "90%", height: "500px", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column" }}>
                        {messages.map((msg, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                                <Typography sx={{ maxWidth: "70%", padding: "10px", borderRadius: "12px", backgroundColor: msg.sender === "user" ? "rgba(255,77,77,0.2)" : "rgba(255,255,255,0.1)", color: msg.sender === "user" ? "#ff4d4d" : "#ffffff" }}>
                                    {msg.text}
                                </Typography>
                            </Box>
                        ))}
                      {awaitingGenre && (
    <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
        {genres.map((g) => (
            <Button 
                key={g} 
                onClick={() => handleGenreSelection(g)}  
                sx={{
                    backgroundColor: "#a52929",
                    color: "white",
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#881818" },
                }}
            >
                {g}
            </Button>
        ))}
    </Box>
)}

{awaitingLanguage && (
    <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
        {languages.map((l) => (
            <Button 
                key={l} 
                onClick={() => handleLanguageSelection(l)}  
                sx={{
                    backgroundColor: "#a52929",
                    color: "white",
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#881818" },
                }}
            >
                {l}
            </Button>
        ))}
    </Box>
)}



                    </Box>
                    <Box display="flex" alignItems="center" mt={2} gap={1}>
                        <Button variant="contained" style={{ backgroundColor: "#a52929", color: "white" }} onClick={() => alert("Chat ended!")}>End</Button>
                        <TextField fullWidth variant="outlined" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}  sx={{
        input: { color: "white" }, // Makes input text white
        "& .MuiOutlinedInput-root": {
            
            
            "&.Mui-focused fieldset": {
                borderColor: "red", // Border color when focused (selected)
            },
        },
    }} />
                        <IconButton onClick={handleSendMessage} style={{ backgroundColor: "red", color: "white" }}><Send /></IconButton>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default Chatbot;
