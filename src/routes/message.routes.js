const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'Messages endpoint' }));

module.exports = router;
