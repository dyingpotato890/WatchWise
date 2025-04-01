import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";

const History = () => {
    const [movies, setMovies] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:5010/api/fetchHistory", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch history");
            }

            const data = await response.json();
            if (data && data.history) {
                setMovies(data.history);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

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
                {movies.map((movie) => (
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