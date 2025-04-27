const express = require('express');
const cors = require('cors');
const OSS = require('ali-oss');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OSS client
const ossClient = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
});

// Leaderboard filename in OSS
const LEADERBOARD_FILE = 'leaderboard.json';

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    let leaderboard = [];
    
    try {
      // Try to get existing leaderboard
      const result = await ossClient.get(LEADERBOARD_FILE);
      leaderboard = JSON.parse(result.content.toString());
    } catch (err) {
      // If file doesn't exist, create a new leaderboard
      if (err.code === 'NoSuchKey') {
        await ossClient.put(LEADERBOARD_FILE, Buffer.from(JSON.stringify([])));
      } else {
        throw err;
      }
    }
    
    // Sort by score and limit to top 10
    leaderboard.sort((a, b) => b.score - a.score);
    const top10 = leaderboard.slice(0, 10);
    
    res.json(top10);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).send('Failed to retrieve leaderboard');
  }
});

// Submit a new score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { playerName, score, level, enemiesDefeated, coinsCollected } = req.body;
    
    // Validate input
    if (!playerName || typeof score !== 'number') {
      return res.status(400).send('Invalid score data');
    }
    
    // Create score entry
    const newScore = {
      id: uuidv4(),
      playerName,
      score,
      level: level || 1,
      enemiesDefeated: enemiesDefeated || 0,
      coinsCollected: coinsCollected || 0,
      timestamp: Date.now()
    };
    
    // Get current leaderboard
    let leaderboard = [];
    try {
      const result = await ossClient.get(LEADERBOARD_FILE);
      leaderboard = JSON.parse(result.content.toString());
    } catch (err) {
      if (err.code !== 'NoSuchKey') {
        throw err;
      }
    }
    
    // Add new score
    leaderboard.push(newScore);
    
    // Sort and save back to OSS
    leaderboard.sort((a, b) => b.score - a.score);
    await ossClient.put(LEADERBOARD_FILE, Buffer.from(JSON.stringify(leaderboard)));
    
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).send('Failed to submit score');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Leaderboard service running on port ${PORT}`);
});