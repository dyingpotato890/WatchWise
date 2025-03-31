import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import Navbar from "../../components/Navbar";
import "./SignUp.css"; // Import the CSS file
import axios from "axios";

const SignUp = () => {
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
                }),
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);
    const [fullName, setFullName] = useState("");
    const [bio,setBio] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [matchError, setMatchError] = useState("");

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Validate password: at least 8 characters, one special character, and one number
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError(
                "Password must be at least 8 characters long and include at least one special character and one number.",
            );
        } else {
            setError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
            setMatchError("Passwords do not match.");
        } else {
            setMatchError("");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5010/api/register",
                {
                    email,
                    password,
                    name: fullName,
                },
                {
                    headers: {
                        "Content-Type": "application/json", // Ensure JSON format
                    },
                },
            );

            if (response.status === 201 || response.status === 200) {
                alert("Account Created Successfully!");
                navigate("/login");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(
                "Account Creation Failed! " + (error.response?.data?.message || ""),
            );
        }
    };
    const isFormValid =
        fullName && email && password && confirmPassword && !error && !matchError;

    return (
        <>
            <Navbar />
            <div
                ref={vantaRef}
                style={{
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            ></div>
            <Container
                component="main"
                maxWidth="xs"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Paper
                    elevation={10}
                    className="signup-paper" // Add animation class
                    style={{
                        padding: "2rem",
                        backgroundColor: "rgba(0,0,0,0)",
                        color: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
                        transform: "scale(1)",
                        transition: "transform 0.3s ease-in-out",
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Sign Up
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            required
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                            error={!!error}
                            helperText={error}
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Re-enter Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{ style: { color: "white" } }}
                            style={{ marginBottom: "1rem" }}
                            error={!!matchError}
                            helperText={matchError}
                            className="animated-input" // Add animation class
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="animated-button" // Add animation class
                            style={{
                                backgroundColor: isFormValid ? "red" : "grey",
                                color: "white",
                                transition: "background-color 0.3s ease-in-out",
                            }}
                            disabled={!isFormValid}
                        >
                            Create Account
                        </Button>
                    </form>

                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link href="/login" style={{ color: "red" }}>
                                Login Here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default SignUp;
