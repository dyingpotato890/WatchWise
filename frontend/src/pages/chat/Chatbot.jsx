import { useEffect, useRef, useState } from "react";
import { Container, TextField, Button, Paper, Box, Typography, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import "./Chatbot.css"; // Import the CSS file for animations

const Chatbot = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Establish the Vanta.js background effect
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
                    color: 0xdb0000,
                    backgroundColor: 0x000000,
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    // Function to send message to backend
    const handleSendMessage = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: "user" };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");
    
            try {
                const response = await fetch("http://localhost:5010/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_input: input }),
                });
    
                const data = await response.json();

                // Extract and format bot response
                const botMessage = `Mood: ${data.mood || "Not detected"}\n`;
                // Genre: ${data.genre || "Not specified"}\nLanguage: ${data.language || "Not specified"}

                // Update chat messages
                setMessages((prev) => [
                    ...prev,
                    { text: botMessage, sender: "bot" },
                    { text: "Is this correct? If YES then enter 'yes', else, please specify your mood again.", sender: "bot" }
                ]);

            } catch (error) {
                setMessages((prev) => [...prev, { text: "Error connecting to server!", sender: "bot" }]);
            }
        }
    };

    // Fetch the first AI message when the page loads
    useEffect(() => {
        setMessages([{ text: "Describe how you're feeling.", sender: "bot" }]);
    }, []);

    return (
        <>
            <Navbar />
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
            <Container
                component="main"
                maxWidth="lg"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "500px",
                    width: "100vw",
                    marginTop: "130px",
                    marginBottom: "70px",
                }}
            >
                <Paper
                    elevation={10}
                    className="chat-window"
                    style={{
                        marginTop: "40px",
                        padding: "2rem",
                        backgroundColor: "rgba(0, 0, 0, 0.29)",
                        color: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
                        width: "90%",
                        height: "500px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden",
                    }}
                >
                    {/* Chat Messages */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "8px", // Adds spacing between messages
                                }}
                            >
                                <Typography
                                    sx={{
                                        maxWidth: "70%",
                                        wordWrap: "break-word",
                                        padding: "10px",
                                        borderRadius: "12px",
                                        backgroundColor: msg.sender === "user" ? "rgba(255, 77, 77, 0.2)" : "rgba(255, 255, 255, 0.1)",
                                        color: msg.sender === "user" ? "#ff4d4d" : "#ffffff",
                                        boxShadow: msg.sender === "user" ? "0 0 10px rgba(255, 77, 77, 0.8)" : "none",
                                        textAlign: "left",
                                    }}
                                >
                                    {msg.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Input and Send Button */}
                    <Box display="flex" alignItems="center" mt={2} gap={1}>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#a52929",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                            }}
                            onClick={() => alert("Chat ended!")}
                        >
                            End
                        </Button>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) { // Send message on Enter, but allow Shift+Enter for new line
                                    e.preventDefault(); // Prevents adding a new line
                                    handleSendMessage(); // Calls the function to send the message
                                }
                            }}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                        />

                        <IconButton
                            onClick={handleSendMessage}
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                padding: "10px",
                                borderRadius: "20px",
                                transition: "0.3s ease-in-out",
                            }}
                        >
                            <Send style={{ fontSize: "24px" }} />
                        </IconButton>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default Chatbot;