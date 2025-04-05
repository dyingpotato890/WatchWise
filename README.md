# WatchWise - Mood Based Movie Recommendation System
<br/>

![WatchWise Logo](https://github.com/dyingpotato890/WatchWise/blob/main/frontend/src/assets/logo.png)

<br/>

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [UML Diagrams](#uml-diagrams)
- [Installation](#installation)
<!---
- [API Documentation](#api-documentation)

  - [Authentication Endpoints](#authentication-endpoints)
  - [Movie Endpoints](#movie-endpoints)
  - [User Endpoints](#user-endpoints)
  -->
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Overview

 WatchWise, introduces a novel approach to personalized movie
 recommendations by integrating mood-based analysis with
 hybrid recommendation algorithms. This system combines
 Content-Based Filtering (CB) and Collaborative Filtering
 (CF) to deliver diverse and tailored suggestions. Users
 interact with the system by describing their current mood,
 from which an appropriate emotional state is extracted.
 Movies aligning with this mood are then recommended,
 ensuring a more engaging and intuitive user experience.

## Features

- **Smart Recommendations**: Get personalized movie suggestions based on your viewing history and preferences
- **Advanced Filtering**: Search for movies by genre, release year, director, actors, and more
- **User Reviews**: Share your thoughts and read what others have to say about films
- **Watchlist Management**: Save movies to watch later and track your viewing history
- **Community Ratings**: See how other users have rated movies to make informed decisions

## Technology Stack

- **Frontend**: React.js, Redux, Material-UI
- **Backend**: Flask
- **Database**: MongoDB
- **Authentication**: JWT
- **API Integration**: TMDB (The Movie Database), Gemini

## UML Diagrams

### Architecture Diagram:

<p align="center">
  <img src="https://github.com/dyingpotato890/WatchWise/blob/main/documents/UML%20Diagrams/Architecture%20Diagram%20-%20WatchWise%20(2).png" width="60%">
</p>

### ER Diagrams:

<p align="center">
  <img src="https://github.com/dyingpotato890/WatchWise/blob/main/documents/UML%20Diagrams/ER%20Diagrams/ER%20Diagram%20-%20WatchWise.png" width="60%">
</p>

<p align="center">
  <img src="https://github.com/dyingpotato890/WatchWise/blob/main/documents/UML%20Diagrams/ER%20Diagrams/ER%20Diagram%20(Movies)%20-%20WatchWise.png" width="60%">
</p>

<p align="center">
  <img src="https://github.com/dyingpotato890/WatchWise/blob/main/documents/UML%20Diagrams/ER%20Diagrams/ER%20Diagram%20(Ratings)%20-%20WatchWise.png" width="60%">
</p>

### Activity Diagram

<p align="center">
  <img src="https://github.com/dyingpotato890/WatchWise/blob/main/documents/UML%20Diagrams/Activity%20Diagram%20-%20WatchWise.png" width="60%">
</p>

## Installation

### Prerequisites
- Python 3.9 or later.
- Node.js and npm.
- MongoDB Server.

### Steps
#### NOTE: If you are using the project for the first time, ensure to set environment variables for GEMINI and MongoDB.

1. Clone the repository:
    ```bash
    git clone https://github.com/dyingpotato890/WatchWise.git
    cd WatchWise
    ```
2. Set up the backend:
    - Navigate to the backend folder:
      ```bash
      cd backend
      ```
    - Install required Python dependencies:
      ```bash
      pip install -r requirements.txt
      ```
    - Configure Environment Variable:
      ```bash
      GEMINI_API_KEY_CHATBOT=your_gemini_api_key
      ```     
    - Run the backend:
      ```bash
      cd ..
      python backend/server.py
      ```
3. Set up the frontend:
    - Navigate to the frontend folder:
      ```bash
      cd frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the development server:
      ```bash
      npm start
      ```
---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Submit a pull request.

---

## Contributors
1. [Gayathri K. Binoy](https://github.com/Gayathri-K-Binoy)
2. [Megha B](https://github.com/MEGHALINN)
3. [Nihar Niranjan](https://github.com/nihar-2004)
4. [Niranjay Ajayan](https://github.com/dyingpotato890)

## License
This project is licensed under the GPL-3.0 License. See the `LICENSE` file for details.
