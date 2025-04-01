import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const Profile = () => {
    return (
        <Box sx={{ width: "100%", maxWidth: 500, margin: "auto" }}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>Name:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography sx={{ textAlign: "left" }}>John Doe</Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>Email:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography sx={{ textAlign: "left" }}>john.doe@example.com</Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>Member Since:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography sx={{ textAlign: "left" }}>2022</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>Bio</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography sx={{ textAlign: "left" }}>More productivity with premium!,</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
