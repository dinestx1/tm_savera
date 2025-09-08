const express = require('express')
const {loginViaOtp, verifyOtp, verifyTokenAndLoadAdmin, signUp } = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const authRouter = express.Router();

authRouter.post('/auth/signup', signUp)
authRouter.get('/:email', loginViaOtp)
authRouter.post('/verify/:email', verifyOtp)
authRouter.get('/:token', authMiddleware, verifyTokenAndLoadAdmin)

module.exports = { authRouter };
