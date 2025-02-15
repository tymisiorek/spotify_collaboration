// routes/networkRoutes.js
const express = require('express');
const router = express.Router();
const { runQuery } = require('../services/neo4jService');

// Example route: Fetch all collaborations
router.get('/', async (req, res) => {
  const cypher = `
    MATCH (a:Artist)-[r:COLLABORATED_WITH]->(b:Artist)
    RETURN a, b, r
  `;
  try {
    const records = await runQuery(cypher);
    // Format your results into a JSON-friendly structure if necessary
    const collaborations = records.map(record => ({
      artistA: record.get('a').properties,
      artistB: record.get('b').properties,
      collaboration: record.get('r').properties,
    }));
    res.json({ collaborations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network data.' });
  }
});

module.exports = router;
