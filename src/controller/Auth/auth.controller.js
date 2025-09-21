const jwt = require('jsonwebtoken')
const { prisma } = require('../../../config/db')
const { sendEmail, newOtp } = require('../../utils/mail/otp.mail')

// LOGIN CONTROLLER ------>

const loginViaOtp = async (req, res) => {
  const { email } = req.params

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Generate OTP (6-digit)
    const otp = newOtp()
    const otpTimestamp = Date.now()
    const otpExpiry = otpTimestamp + 10 * 60 * 1000

    // Save OTP + expiry (5 min)
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpire: new Date(otpExpiry),
      },
    })

    // Choose Template and send OTP
    const templateType = 'newUserOtp'
    await sendEmail(email, templateType, { otp, email })

    console.log(`✅ OTP for ${email}: ${otp}`)

    return res.render('otp', {
      emailSent: true,
      email,
      message: 'otp sent',
    })
    // .status(200).json({
    //     message: "OTP sent to email. Please verify.",
    //     email,
    // });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

const verifyOtp = async (req, res) => {
  const { email } = req.params
  const { otp } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' })
    }

    if (new Date() > new Date(user.otpExpire)) {
      return res.status(410).json({ error: 'OTP expired' })
    }

    console.log(user)

    // clear OTP
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpire: null },
    })

    const refreshToken = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        companyId: user.companyId,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '90d' }
    )

    const accessToken = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    return (
      res
        // .redirect(`http://localhost:8080/dashboard/${token}`)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 90 * 24 * 60 * 60 * 1000,
        })
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1h
        })
        .status(200)
        .json({
          message: 'OTP verified successfully',
          refreshToken,
          accessToken,
        })
    )
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

const verifyTokenAndLoadAdmin = async (req, res) => {
  const accessToken = req.cookies?.accessToken
  console.log(accessToken)

  if (!accessToken) {
    return res.status(401).json({ message: 'No refresh token provided' })
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

    console.log('Token Decode', decoded)

    // FIX: use userID instead of id
    const { userID, email, companyId } = decoded

    const newAccessToken = jwt.sign({ userID, email, companyId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.cookie('authToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h
    })

    return res.json({
      message: 'Welcome to Admin Panel ✅',
      authToken: newAccessToken,
      refreshToken: req.cookies.refreshToken,
    })
  } catch (err) {
    console.log('JWT Verify Error:', err.message)
    return res.status(401).json({ error: 'Unauthorized access' })
  }
}

const routingDashboard = async (req, res) => {
  try {
    console.log('Decoded user from middleware:', req.user)

    return res.json({
      message: `Welcome to Admin Dashboard ✅`,
      user: req.user,
    })
  } catch (err) {
    console.error('Dashboard error:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

// SIGN UP CONTROLLER ------>
const signUp = async (req, res) => {
  try {
    const { email, name, role, companyId } = req.body

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists ❌' })
    }

    // check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found ❌' })
    }

    // create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role, // "ADMIN", "USER", or "MANAGER"
        company: {
          connect: { id: companyId }, // ✅ link user to existing company
        },
      },
    })

    return res.status(201).json({
      message: 'User signed up successfully ✅',
      user: newUser,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Failed to create user' })
  }
}

module.exports = { loginViaOtp, verifyOtp, verifyTokenAndLoadAdmin, routingDashboard, signUp }
