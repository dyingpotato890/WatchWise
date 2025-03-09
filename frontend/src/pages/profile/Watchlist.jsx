import React from "react";
import { Box, Typography } from "@mui/material";

const Watchlist = () => {
    const watchlist = ["Movie 1", "Movie 2", "Movie 3"];

    return (
        <Box>
            <Typography variant="h4">Watchlist</Typography>
            {watchlist.map((movie, index) => (
                <Typography key={index}>{movie}</Typography>
            ))}
        </Box>
    );
};

export default Watchlist;
