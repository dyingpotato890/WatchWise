import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';

const MovieRecommendation = () => {
    const moodEmojis = {
        Happy: '😊',
        Sad: '😢',
        Excited: '🤩',
        Romantic: '❤️'
    };

    return (
        <Container
            component="main"
            maxWidth="sm"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
            <Paper
                elevation={10}
                style={{
                    padding: '2rem',
                    backgroundColor: '#000000',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(255, 0, 0, 0.8)'
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Movie Recommendation System
                </Typography>

                <Box textAlign="center">
                    {Object.keys(moodEmojis).map(mood => (
                        <Button
                            key={mood}
                            style={{
                                margin: '0.5rem',
                                backgroundColor: 'grey',
                                color: 'white'
                            }}
                        >
                            {moodEmojis[mood]} {mood}
                        </Button>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default MovieRecommendation;
