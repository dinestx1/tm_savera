const express = require('express')
const authController = require('../controller/Auth/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { loginViaOtp } = require('../controller/Auth/loginViaOtp.controller')
const { verifyOtp } = require('../controller/Auth/verifyOtp.controller')
const { paramsVerifyOtp } = require('../controller/Auth/paramOtp.controller')

const authRouter = express.Router()

authRouter.post('/auth/signup', authController.signUp)
authRouter.post('/auth/generateOtp', loginViaOtp) // Working fine
authRouter.post('/auth/verifyOtp', verifyOtp) // Working fine
// authRouter.get('/otp/verification', paramsVerifyOtp, authController.verifyTokenAndLoadAdmin)

// authRouter.get(
//   '/dashboard/:accessToken',
//   // authController.verifyTokenAndLoadAdmin
//   // authMiddleware.verifyAccessToken
// )
authRouter.get(
  '/admin/dashboard',
  authMiddleware.verifyAccessToken,
  authController.routingDashboard
)

module.exports = { authRouter }
