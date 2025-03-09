import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const History = () => {
    const history = [
        { id: 1, title: "Movie A", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 8 },
        { id: 2, title: "Movie B", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 7 },
        { id: 3, title: "Movie C", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 9 },
        { id: 4, title: "Movie D", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 6 },
        { id: 5, title: "Movie E", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 8.5 },
        { id: 6, title: "Movie F", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 7.2 },
        { id: 7, title: "Movie G", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 9.3 },
        { id: 8, title: "Movie H", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 8.1 },
        { id: 9, title: "Movie I", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 6.7 },
        { id: 10, title: "Movie J", poster: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", rating: 7.9 },
    ];

    return (
        <Box
            sx={{
                padding: "20px",
                textAlign: "center",
                overflowY: "auto",
                maxHeight: "calc(100vh - 80px)",
                scrollbarWidth: "thin",
                scrollbarColor: "darkred black",
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "black",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "darkred",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "#8B0000",
                },
            }}
        >
            <Typography variant="h4" gutterBottom>
                Watch History
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {history.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <Box
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 10px rgba(255,0,0,0.3)",
                                textAlign: "center",
                                position: "relative",
                            }}
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={{
                                    width: "150px",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <Typography variant="h6" mt={1}>
                                {movie.title}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Rating: ⭐ {movie.rating} / 10
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default History;
