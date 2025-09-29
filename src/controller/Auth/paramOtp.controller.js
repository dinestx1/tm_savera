const { verifyOtp } = require('./auth.controller')

const paramsVerifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.query

    if (!email || !otp) return res.status(400).send('Email and OTP required')

    email = decodeURIComponent(email)
    console.log('decode email', email)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // ✅ Ensure req.body exists
    if (!req.body) req.body = {}

    req.params.email = emailRegex.test(email) ? email : null
    req.body.otp = otp
    const accessToken = await verifyOtp(req, res)
    console.log('OTP verified successfully', accessToken)
    // Redirect user including access token if needed
    return res.redirect(`http://localhost:3000/dashboard/${accessToken.accessToken}`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { paramsVerifyOtp }
