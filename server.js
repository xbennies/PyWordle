const express = require('express');
const cors = require('cors');  // Import the cors package
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');
const app = express();
const port = 443;

// Allow all origins for CORS (can be customized later)
app.use(cors());

const dailyWordPath = path.join(__dirname, 'webservice', 'dailyword');

// Function to get today's word (or select a random word)
function getWordForToday() {
  const words = fs.readFileSync(path.join(__dirname, 'webservice', 'words'), 'utf8').split('\n');
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].trim();
}

// API route to get the daily word
app.get('/api/dailyword', (req, res) => {
  fs.readFile(dailyWordPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read dailyword file' });
    } else {
      res.json({ word: data.trim() });
    }
  });
});

// New API route to manually update the word
app.get('/api/updateword', (req, res) => {
  const newWord = getWordForToday();
  
  fs.writeFile(dailyWordPath, newWord, 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating dailyword file' });
    }
    res.json({ message: `Daily word updated to: ${newWord}` });
  });
});

// Start the cron job to update the word every day at midnight
cron.schedule('0 0 * * *', () => {
  const newWord = getWordForToday();
  fs.writeFile(dailyWordPath, newWord, 'utf8', (err) => {
    if (err) {
      console.error('Error updating daily word:', err);
    } else {
      console.log(`Daily word updated to: ${newWord}`);
    }
  });
});

// Serve static files (like your HTML, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
