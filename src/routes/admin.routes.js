const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', (req, res) => res.json({ message: 'Admin dashboard endpoint' }));
router.get('/trainers', (req, res) => res.json({ message: 'Admin trainers endpoint' }));
router.get('/clients', (req, res) => res.json({ message: 'Admin clients endpoint' }));

module.exports = router;
