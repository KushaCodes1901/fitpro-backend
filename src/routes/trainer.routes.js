const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate, authorize('TRAINER'));

router.get('/dashboard', (req, res) => res.json({ message: 'Trainer dashboard endpoint' }));
router.get('/clients', (req, res) => res.json({ message: 'Trainer clients endpoint' }));
router.get('/plans', (req, res) => res.json({ message: 'Trainer plans endpoint' }));
router.get('/nutrition', (req, res) => res.json({ message: 'Trainer nutrition endpoint' }));
router.get('/schedule', (req, res) => res.json({ message: 'Trainer schedule endpoint' }));

module.exports = router;
