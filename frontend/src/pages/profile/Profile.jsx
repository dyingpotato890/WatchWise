import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { Box, Typography, Avatar, Grid, Paper, Container, Card, CardMedia, Divider, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Profile from "../../components/UserProfile";
import Watchlist from "../../components/Watchlist";
import History from "../../components/History";

const UserProfile = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "",
        avatar: "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg",
        bio: "",
    });
    const [statsData, setStatsData] = useState({
        watch_history: 0,
        watch_list: 0
    });
    const [recentlyWatched, setRecentlyWatched] = useState([]);

    const fetchUserData = async () => {
        console.log("Fetching user data...");
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.warn("No access token found. User might not be logged in.");
                return;
            }

            const response = await fetch("http://localhost:5010/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            console.log("API Response Status:", response.status);

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized access. Token may be invalid or expired.");
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched User Data:", data);

            setUserData({
                name: data.data.name || "Unknown User",
                email: data.data.email || "No email provided",
                avatar: data.data.avatar || "https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg",
                bio: data.data.bio || "No bio available",
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchStatsData = async () => {
        console.log("Fetching stats data...");
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.warn("No access token found. User might not be logged in.");
                return;
            }

            const response = await fetch("http://localhost:5010/api/count", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            console.log("Stats API Response Status:", response.status);

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized access. Token may be invalid or expired.");
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched Stats Data:", data);

            setStatsData({
                watch_history: data.data.watch_history || 0,
                watch_list: data.data.watch_list || 0
            });
        } catch (error) {
            console.error("Error fetching stats data:", error);
        }
    };

    const fetchRecentlyWatched = async () => {
        console.log("Fetching recently watched...");
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.warn("No access token found. User might not be logged in.");
                return;
            }

            const response = await fetch("http://localhost:5010/api/recentlyWatched", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            console.log("Recently Watched API Response Status:", response.status);

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized access. Token may be invalid or expired.");
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched Recently Watched Data:", data);

            // Based on the provided API response structure
            if (data.data && data.data.length > 0 && Array.isArray(data.data[0])) {
                setRecentlyWatched(data.data[0]);
            } else {
                setRecentlyWatched([]);
            }
        } catch (error) {
            console.error("Error fetching recently watched:", error);
            setRecentlyWatched([]);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchStatsData();
        fetchRecentlyWatched();
    }, []);

    useEffect(() => {
        if (!vantaEffect && window.VANTA) {
            setVantaEffect(
                window.VANTA.NET({
                    el: vantaRef.current,
                    mouseControls: true,
                    touchControls: true,
                    backgroundColor: 0x000000,
                    color: 0xdb0000,
                    points: 20,
                    maxDistance: 20,
                    spacing: 20
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const statsCards = [
        { 
            title: "Watchlist", 
            value: statsData.watch_list.toString(), 
            icon: "📋",
            bgColor: "rgba(220, 20, 60, 0.2)"
        },
        { 
            title: "History", 
            value: statsData.watch_history.toString(), 
            icon: "🕒",
            bgColor: "rgba(255, 69, 0, 0.2)"
        }
    ];

    const recentHistory = [
        {
            title: "Movie Title 1",
            poster: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600",
            rating: 4.5,
            genre: "Action"
        },
        {
            title: "Movie Title 2",
            poster: "https://c.ndtvimg.com/gws/ms/movies-with-the-most-oscar-wins/assets/2.jpeg?1727706937",
            rating: 4.2,
            genre: "Drama"
        },
        {
            title: "Movie Title 3",
            poster: "https://akamaividz2.zee5.com/image/upload/w_336,h_504,c_scale,f_webp,q_auto:eco/resources/0-0-1z5254199/portrait/1920x770f481a92fa3fe4029bc0e897803d0113a.jpg",
            rating: 4.7,
            genre: "Thriller"
        },
    ];

    return (
        <>
            <Navbar />
            <div 
                ref={vantaRef} 
                style={{ 
                    position: "fixed", 
                    top: 0, 
                    left: 0, 
                    width: "100vw", 
                    height: "100vh", 
                    zIndex: -1 
                }}
            />

            <Box 
                sx={{ 
                    position: "relative", 
                    zIndex: 1, 
                    marginTop: "100px", 
                    color: "white" 
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* Sidebar */}
                        <Grid item xs={12} md={3}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    border: "1px solid rgba(220, 20, 60, 0.3)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Avatar 
                                        src={userData.avatar} 
                                        sx={{ 
                                            width: 100, 
                                            height: 100, 
                                            margin: '0 auto',
                                            border: '3px solid crimson'
                                        }} 
                                    />
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            mt: 2, 
                                            color: 'crimson', 
                                            fontWeight: 'bold' 
                                        }}
                                    >
                                        {userData.name}
                                    </Typography>
                                </Box>

                                {/* User Stats */}
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    {statsCards.map((stat) => (
                                        <Grid item xs={6} key={stat.title}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    backgroundColor: stat.bgColor,
                                                    padding: '10px',
                                                    textAlign: 'center',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '1.5rem' }}>{stat.icon}</Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'crimson', 
                                                        fontWeight: 'bold' 
                                                    }}
                                                >
                                                    {stat.value}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                                                >
                                                    {stat.title}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Tabs */}
                                {["profile", "watchlist", "history"].map((tab) => (
                                    <motion.div 
                                        key={tab}
                                        whileHover={{ scale: 1.05 }}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        <Paper
                                            elevation={activeTab === tab ? 6 : 2}
                                            sx={{
                                                backgroundColor: activeTab === tab 
                                                    ? 'rgba(220, 20, 60, 0.3)' 
                                                    : 'rgba(0, 0, 0, 0.5)',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                border: activeTab === tab 
                                                    ? '1px solid crimson' 
                                                    : '1px solid transparent'
                                            }}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    textTransform: 'capitalize', 
                                                    color: 'white',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {tab}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                ))}
                            </Paper>
                        </Grid>

                        {/* Content Area */}
                        <Grid item xs={12} md={9}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    border: "1px solid rgba(220, 20, 60, 0.3)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    minHeight: "600px"
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {activeTab === "profile" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {/* Profile Details Section */}
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    color: 'crimson', 
                                                    mb: 3,
                                                    borderBottom: '2px solid crimson',
                                                    paddingBottom: '10px'
                                                }}
                                            >
                                                Profile Details
                                            </Typography>
                                            
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={4}>
                                                    <Avatar 
                                                        src={userData.avatar} 
                                                        sx={{ 
                                                            width: 200, 
                                                            height: 200, 
                                                            margin: '0 auto',
                                                            border: '3px solid crimson'
                                                        }} 
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Paper 
                                                        elevation={2}
                                                        sx={{
                                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                                            padding: '20px',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        <Typography variant="h6" sx={{ color: 'crimson', mb: 2 }}>
                                                            Personal Information
                                                        </Typography>
                                                        <Divider sx={{ backgroundColor: 'rgba(220,20,60,0.3)', mb: 2 }} />
                                                        
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body1" sx={{ color: 'white' }}>
                                                                    <strong style={{color: 'crimson'}}>Name:</strong> {userData.name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body1" sx={{ color: 'white' }}>
                                                                    <strong style={{color: 'crimson'}}>Email:</strong> {userData.email}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1" sx={{ color: 'white' }}>
                                                                    <strong style={{color: 'crimson'}}>Bio:</strong> {userData.bio}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {/* Recently Watched Section */}
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    color: 'crimson', 
                                                    mb: 3,
                                                    mt: 4,
                                                    borderBottom: '2px solid crimson',
                                                    paddingBottom: '10px'
                                                }}
                                            >
                                                Recently Watched
                                            </Typography>
                                            
                                            <Grid container spacing={3}>
                                                {recentlyWatched.length > 0 ? (
                                                    recentlyWatched.map((movie) => (
                                                        <Grid item xs={12} sm={6} md={4} key={movie.show_id}>
                                                            <Card 
                                                                sx={{ 
                                                                    backgroundColor: 'rgba(0,0,0,0.5)', 
                                                                    border: '1px solid rgba(220, 20, 60, 0.3)',
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    flexDirection: 'column'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: 'relative',
                                                                        paddingTop: '150%', // This creates a 2:3 aspect ratio container (standard movie poster)
                                                                        width: '100%',
                                                                        overflow: 'hidden'
                                                                    }}
                                                                >
                                                                    <CardMedia
                                                                        component="img"
                                                                        image={movie.poster}
                                                                        alt={movie.title}
                                                                        sx={{ 
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                            filter: 'brightness(0.8)'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Box sx={{ p: 2, color: 'white', flexGrow: 1 }}>
                                                                    <Typography 
                                                                        variant="h6" 
                                                                        sx={{ 
                                                                            color: 'crimson',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical'
                                                                        }}
                                                                    >
                                                                        {movie.title}
                                                                    </Typography>
                                                                    
                                                                    {/* Display only the primary genre as a chip */}
                                                                    <Box sx={{ my: 1 }}>
                                                                        <Chip 
                                                                            label={getPrimaryGenre(movie.genre)} 
                                                                            size="small"
                                                                            sx={{ 
                                                                                backgroundColor: 'rgba(220, 20, 60, 0.2)',
                                                                                borderColor: 'rgba(220, 20, 60, 0.5)',
                                                                                color: 'white',
                                                                                fontSize: '0.75rem'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    
                                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                                        Rating: {movie.rating}/10
                                                                    </Typography>
                                                                </Box>
                                                            </Card>
                                                        </Grid>
                                                    ))
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Paper
                                                            sx={{
                                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                                padding: '30px',
                                                                textAlign: 'center',
                                                                borderRadius: '8px',
                                                                border: '1px dashed rgba(220, 20, 60, 0.3)'
                                                            }}
                                                        >
                                                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                                No recently watched content
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                                                                Start watching to see your history here
                                                            </Typography>
                                                        </Paper>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </motion.div>
                                    )}
                                    {activeTab === "watchlist" && <Watchlist />}
                                    {activeTab === "history" && <History />}
                                </AnimatePresence>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default UserProfile;