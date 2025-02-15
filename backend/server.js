// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working locally!' });
});

const networkRoutes = require('./routes/networkRoutes');
app.use('/api/network', networkRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
