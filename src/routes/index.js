const express = require('express');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const trainerRoutes = require('./trainer.routes');
const clientRoutes = require('./client.routes');
const messageRoutes = require('./message.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/trainer', trainerRoutes);
router.use('/client', clientRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
