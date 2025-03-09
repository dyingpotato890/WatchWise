import React from "react";
import { Box, Typography } from "@mui/material";

const History = () => {
    const history = ["Movie A", "Movie B", "Movie C"];

    return (
        <Box>
            <Typography variant="h4">Watch History</Typography>
            {history.map((movie, index) => (
                <Typography key={index}>{movie}</Typography>
            ))}
        </Box>
    );
};

export default History;
