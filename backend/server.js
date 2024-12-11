// Load environment variables from a .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');  // Import the Google Gemini library
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 5501;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Debug: Log API Key (optional)
console.log("Google Gemini API Key:", process.env.GEMINI_API_KEY);

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// API endpoint for chatting
app.post('/api/chat', async (req, res) => {
  const { message } = req.body; // Extract message from frontend

  // Ensure input validation
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Request content generation from Google Gemini API
    const result = await model.generateContent(message);
    
    // Log the full API response to understand its structure
    console.log('API Response:', result);
    
    // Extract the response text based on the structure (adjust if necessary)
    const responseText = result.response && result.response.text ? result.response.text() : 'No response content available';

    // Send back the generated response to the frontend
    res.json({ reply: responseText });
    
  } catch (error) {
    // Handle errors (e.g., rate limit, server error)
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
