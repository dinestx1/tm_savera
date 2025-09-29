const { prisma } = require('../../../config/db')
const { sendEmail, newOtp } = require('../../utils/mail/otp.mail')

const loginViaOtp = async (req, res) => {
  const { email, companyId } = req.body

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    // 1️⃣ Fetch user (SUPERADMIN or ADMIN/USER)
    const user = companyId
      ? await prisma.user.findUnique({
          where: { email_companyId: { email, companyId } },
        })
      : await prisma.user.findFirst({
          where: { email, role: 'SUPERADMIN' },
        })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // 2️⃣ Generate OTP & expiry
    const otp = newOtp()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    // 3️⃣ Update OTP in DB (async, but must await for consistency)
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpire: otpExpiry },
    })

    // 4️⃣ Send email asynchronously (fire-and-forget)
    sendEmail(email, 'newUserOtp', { otp, email }).catch((err) =>
      console.error('OTP email error:', err)
    )

    // 5️⃣ Respond immediately
    return res.status(200).json({
      message: `OTP sent to ${email}. Please verify.`,
    })
  } catch (error) {
    console.error('Login via OTP error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { loginViaOtp }
