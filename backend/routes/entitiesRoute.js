const express = require('express');
const router = express.Router();
const Entity = require('../models/Entity');  // Make sure the path is correct

// Fetch an entity by ID
router.get('/:id', async (req, res) => {
  try {
    const entity = await Entity.findByPk(req.params.id);  // Using Sequelize's findByPk method
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.json(entity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// In your Express backend route
router.get('/entities', async (req, res) => {
    try {
      const entities = await Entity.find(); // Fetch all entities from DB
      res.json(entities);  // Send the list of entities
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch entities' });
    }
  });
  
module.exports = router;
