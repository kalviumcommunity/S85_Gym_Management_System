const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic /ping route
app.get('/', (req, res) => {
    res.send('Hello,I am Madhav.This is my Gym_managment_system');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});