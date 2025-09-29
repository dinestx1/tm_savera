const { prisma } = require('../../../config/db')
const jwt = require('jsonwebtoken')

const verifyOtp = async (req, res) => {
  const { email, otp, companyId } = req.body

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' })
  }

  try {
    let user

    if (companyId) {
      // For ADMIN / USER
      user = await prisma.user.findUnique({
        where: {
          email_companyId: {
            email,
            companyId,
          },
        },
      })
    } else {
      // For SUPERADMIN
      user = await prisma.user.findFirst({
        where: { email, role: 'SUPERADMIN' },
      })
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' })
    }

    if (!user.otpExpire || new Date() > new Date(user.otpExpire)) {
      return res.status(410).json({ error: 'OTP expired' })
    }

    // ✅ Clear OTP after verification
    await prisma.user.update({
      where: { id: user.id }, // use `id` since it's always unique
      data: { otp: null, otpExpire: null },
    })

    // ✅ Generate tokens
    const payload = {
      userID: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId || null,
    }

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '90d',
    })

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h',
    })

    // ✅ Set cookies
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3 * 60 * 60 * 1000, // 3hr
      })

    return res.status(200).json({
      message: 'OTP verified successfully',
      refreshToken,
      accessToken,
    })
  } catch (error) {
    console.error('Error in verifyOtp:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { verifyOtp }
