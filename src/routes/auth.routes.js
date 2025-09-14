const express = require('express')
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const authRouter = express.Router();

authRouter.post(
    '/auth/signup',
    authController.signUp
)
authRouter.get(
    '/:email',
    authController.loginViaOtp
)
authRouter.post(
    '/verify/:email',
    authController.verifyOtp
)
authRouter.get(
    '/dashboard/:accessToken',
    authController.verifyTokenAndLoadAdmin,
    // authMiddleware.verifyAccessToken
)
authRouter.get(
    '/admin/dashboard',
    authMiddleware.verifyAccessToken,
    authController.routingDashboard
)

module.exports = { authRouter };
