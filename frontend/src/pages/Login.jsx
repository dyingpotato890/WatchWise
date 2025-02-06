import React, { useEffect, useRef, useState } from "react";
import { Container, TextField, Button, Typography, Box, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Login = () => {
    const navigate = useNavigate();
    
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);

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

    return (
        <>
            <Navbar />
            <div ref={vantaRef} style={{ position: "absolute", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -1 }}></div>
            <Container
                component="main"
                maxWidth="xs"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={10}
                    style={{
                        padding: "2rem",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(255, 0, 0, 0.8)",
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const email = e.target.email.value;
                            const password = e.target.password.value;
                            axios
                                .post("http://localhost:5010/api/login", { email, password })
                                .then(() => {
                                    alert("Logged in Successfully!");
                                    navigate("/home");
                                })
                                .catch(() => alert("Login Failed!"));
                        }}
                    >
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            type="text"
                            name="email"
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            name="password"
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                        />
                        <Button type="submit" fullWidth variant="contained" style={{ backgroundColor: "red", color: "white" }}>
                            Login
                        </Button>
                    </form>

                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link href="/register" style={{ color: "red" }}>
                                Sign Up Here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default Login;
