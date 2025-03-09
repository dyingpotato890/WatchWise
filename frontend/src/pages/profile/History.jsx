import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const History = () => {
    const history = [
        { id: 1, title: "Ganglands", poster: "https://m.media-amazon.com/images/M/MV5BYWJkOWM3NDQtYmQ0Mi00MzliLTg4YzctNDk2ZjY4NDQwYTRmXkEyXkFqcGc@._V1_SX300.jpg", rating: 8 },
        { id: 2, title: "Code Name: The Cleaner", poster: "https://image.tmdb.org/t/p/w500//y3HOTTyM5nLsdUzXFtFCohG28qj.jpg", rating: 7 },
        { id: 3, title: "Bad Boys", poster: "https://image.tmdb.org/t/p/w500//3cLmGQDoFFa39J7ooPjgwLnAQsL.jpg", rating: 9 },
        { id: 4, title: "American Psycho", poster: "https://image.tmdb.org/t/p/w500//xMBtPjaJ1wTHeUFXVWAdlUZFQSy.jpg", rating: 6 },
        { id: 5, title: "About a Boy", poster: "https://image.tmdb.org/t/p/w500//hshCr07tDJOQV84yX85k3u5M2rG.jpg", rating: 8.5 },
        { id: 6, title: "Not Another Teen Movie", poster: "https://image.tmdb.org/t/p/w500//9ZaGxvj1mqdKVLpSloq4mzS7SK6.jpg", rating: 7.2 },
        { id: 7, title: "Richie Rich", poster: "https://m.media-amazon.com/images/M/MV5BZWEyNTYzNmMtMTFkNC00Zjk4LWI4MzUtMjAzMjZjOTJmMjVmXkEyXkFqcGc@._V1_SX300.jpg", rating: 9.3 },
        { id: 8, title: "My Girl 2", poster: "https://image.tmdb.org/t/p/w500//lGzx99iVL8scyE5i4xt3DM0BpA.jpg", rating: 8.1 },
        { id: 9, title: "Hook", poster: "https://image.tmdb.org/t/p/w500//a6rB1lGXoGms7gWxRfJneQmAjNV.jpg", rating: 6.7 },
        { id: 10, title: "Almost Love", poster: "https://image.tmdb.org/t/p/w500//zLWthIm1tPEaahni2KlVSW4YaJR.jpg", rating: 9 },
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
