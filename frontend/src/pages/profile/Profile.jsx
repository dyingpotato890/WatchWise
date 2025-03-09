import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { Box, Button, Typography, Avatar, Grid, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Profile from "./UserProfile";
import Watchlist from "./Watchlist";
import History from "./History";

const UserProfile = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [activeTab, setActiveTab] = useState("profile");

    const userData = {
        name: "Sarah Connor",
        email: "sarahc@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        bio: "More productivity with premium!",
    };

    const recentHistory = [
        {
            title: "Movie Title 1",
            poster: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        {
            title: "Movie Title 2",
            poster: "https://c.ndtvimg.com/gws/ms/movies-with-the-most-oscar-wins/assets/2.jpeg?1727706937",
        },
        {
            title: "Movie Title 3",
            poster: "https://akamaividz2.zee5.com/image/upload/w_336,h_504,c_scale,f_webp,q_auto:eco/resources/0-0-1z5254199/portrait/1920x770f481a92fa3fe4029bc0e897803d0113a.jpg",
        },
    ];

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

    return (
        <>
            <Navbar />
            <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: -1 }}></div>

            <Box
                sx={{
                    display: "flex",
                    height: "calc(100vh - 100px)",
                    marginTop: "100px",
                    overflow: "hidden",
                }}
            >
                {/* Sidebar Dashboard (Left Side) */}
                <Box
                    sx={{
                        width: "250px",
                        height: "100%",
                        backgroundColor: "rgba(47, 25, 25, 0.15)",
                        backdropFilter: "blur(10px)",
                        padding: "20px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        borderRadius: "0px 12px 12px 0px",
                        boxShadow: "5px 0px 10px rgba(0,0,0,0.3)",
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <Avatar src={userData.avatar} sx={{ width: 40, height: 40 }} />
                    </Box>
                    {["profile", "watchlist", "history"].map((tab) => (
                        <motion.div whileHover={{ scale: 1.1 }} key={tab}>
                            <Button
                                variant={activeTab === tab ? "contained" : "outlined"}
                                color="error"
                                onClick={() => setActiveTab(tab)}
                                sx={{ width: "100%" }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Button>
                        </motion.div>
                    ))}
                </Box>

                {/* Content Section */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                width: "80%",
                                maxWidth: "800px",
                                padding: "20px",
                                borderRadius: "12px",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                boxShadow: "0px 5px 15px rgba(255,0,0,0.3)",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            {activeTab === "profile" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Display Only Name Next to Avatar */}
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Avatar
                                                src={userData.avatar}
                                                sx={{ width: 100, height: 100 }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                                {userData.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {/* Recent History Section */}
                                    <Paper elevation={3} sx={{ padding: "20px", marginTop: "20px", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#ff4d4d" }}>
                                            Recent
                                        </Typography>
                                        <Grid container spacing={2} justifyContent="center">
                                            {recentHistory.map((movie) => (
                                                <Grid item xs={4} key={movie.title}>
                                                    <motion.div whileHover={{ scale: 1.05 }}>
                                                        <img
                                                            src={movie.poster}
                                                            alt={movie.title}
                                                            style={{
                                                                width: "100px",
                                                                height: "150px",
                                                                borderRadius: "8px",
                                                                boxShadow: "0px 4px 8px rgba(255, 0, 0, 0.5)",
                                                                transition: "transform 0.3s ease-in-out",
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ marginTop: "5px", fontSize: "0.85rem", fontWeight: "bold" }}>
                                                            {movie.title}
                                                        </Typography>
                                                    </motion.div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>

                                    {/* User Profile Details */}
                                    <Paper elevation={3} sx={{ padding: "20px", marginTop: "20px", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff4d4d" }}>
                                                    User Profile:
                                                </Typography>
                                            </Grid>
                                            
                                        </Grid>
                                    </Paper>

                                    <Profile />
                                </motion.div>
                            )}
                            {activeTab === "watchlist" && <Watchlist />}
                            {activeTab === "history" && <History />}
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Box>
        </>
    );
};

export default UserProfile;
