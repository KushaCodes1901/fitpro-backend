const express = require('express');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);
router.get('/me', authenticate, controller.me);

module.exports = router;
