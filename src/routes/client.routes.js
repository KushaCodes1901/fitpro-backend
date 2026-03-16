const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate, authorize('CLIENT'));

router.get('/dashboard', (req, res) => res.json({ message: 'Client dashboard endpoint' }));
router.get('/workouts', (req, res) => res.json({ message: 'Client workouts endpoint' }));
router.get('/nutrition', (req, res) => res.json({ message: 'Client nutrition endpoint' }));
router.get('/progress', (req, res) => res.json({ message: 'Client progress endpoint' }));
router.get('/schedule', (req, res) => res.json({ message: 'Client schedule endpoint' }));

module.exports = router;
