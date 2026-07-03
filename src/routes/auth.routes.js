const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validateRequest, registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;
