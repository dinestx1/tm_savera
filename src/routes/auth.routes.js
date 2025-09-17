const express = require('express')
const authController = require('../controller/Auth/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const authRouter = express.Router()

authRouter.post('/auth/signup', authController.signUp)
authRouter.get('/:email', authController.loginViaOtp) // Working fine
authRouter.post('/verify/:email', authController.verifyOtp) // Working fine
authRouter.get(
  '/dashboard/:accessToken',
  authController.verifyTokenAndLoadAdmin
  // authMiddleware.verifyAccessToken
)
authRouter.get(
  '/admin/dashboard',
  authMiddleware.verifyAccessToken,
  authController.routingDashboard
)

module.exports = { authRouter }
