const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET /api/properties
router.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find({});

    if (properties.length === 0) {
      return res.json({ lastUpdated: null, source: null, properties: [] });
    }

    const lastUpdated = properties[0].lastUpdated || null;
    const source = properties[0].source || "Unknown";

    res.json({ lastUpdated, source, properties });
  } catch (err) {
    console.error("Error fetching properties", err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

module.exports = router;
