import { useState } from "react";
import { Container, Button, Paper, Box, Typography, IconButton, Chip, Stack, LinearProgress } from "@mui/material";
import { ChevronRight, ArrowBack } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const GenrePage = ({ onGenresSelect, onBack }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    
    // Extended list of genres
    const genres = [
        "Action & Adventure", "Anime", "British TV Shows", "Children & Family Movies", "Classic", 
        "Comedy", "Crime TV Shows", "Cult", "Documentary", "Drama", "Faith & Spirituality", 
        "Horror", "Independent Movies", "International", "Kids' TV", "Korean TV Shows", 
        "LGBTQ Movies", "Movies", "Music & Musicals", "Mysteries", "Reality TV", "Romantic", 
        "Sci-Fi & Fantasy", "Science & Nature TV", "Spanish-Language TV Shows", "Sports Movies", 
        "Stand-Up Comedy & Talk Shows", "Teen TV Shows", "Thrillers", "TV Shows"
    ];
    

    const handleGenreToggle = (genre) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre) 
                : [...prev, genre]
        );
    };

    // Dividing genres into 3 sections for animation staggering
    const firstRowGenres = genres.slice(0, 10);
    const secondRowGenres = genres.slice(10, 20);
    const thirdRowGenres = genres.slice(20);

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
                            padding: "2rem", 
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
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                                </motion.div>
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
                                        Step 2: Select Your Genres
                                    </Typography>
                                </motion.div>
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
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium", textAlign: "center" }}>
                                    Select one or more genres below, or none if you prefer:
                                </Typography>
                            </motion.div>
                            
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, justifyContent: "center" }}>
                                {/* First row of genres */}
                                {firstRowGenres.map((genre, index) => (
                                    <motion.div
                                        key={genre}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.03, duration: 0.4 }}
                                        whileHover={{ scale: 1.05, y: -3 }}
                                    >
                                        <Chip
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
                                                    bgcolor: selectedGenres.includes(genre) ? "#881818" : "rgba(255,77,77,0.1)"
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                                
                                {/* Second row of genres */}
                                {secondRowGenres.map((genre, index) => (
                                    <motion.div
                                        key={genre}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3 + index * 0.03, duration: 0.4 }}
                                        whileHover={{ scale: 1.05, y: -3 }}
                                    >
                                        <Chip
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
                                                    bgcolor: selectedGenres.includes(genre) ? "#881818" : "rgba(255,77,77,0.1)"
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                                
                                {/* Third row of genres */}
                                {thirdRowGenres.map((genre, index) => (
                                    <motion.div
                                        key={genre}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.6 + index * 0.03, duration: 0.4 }}
                                        whileHover={{ scale: 1.05, y: -3 }}
                                    >
                                        <Chip
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
                                                    bgcolor: selectedGenres.includes(genre) ? "#881818" : "rgba(255,77,77,0.1)"
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </Stack>

                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: 0.9 }}
                                >
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
                                </motion.div>
                            </AnimatePresence>
                        </Box>
                        
                        <Box display="flex" justifyContent="center" mt={3}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
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
                                            backgroundColor: "#881818"
                                        },
                                    }}
                                >
                                    Continue to Language Selection
                                </Button>
                            </motion.div>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </motion.div>
    );
};

export default GenrePage;