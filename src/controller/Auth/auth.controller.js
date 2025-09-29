const jwt = require('jsonwebtoken')
const { prisma } = require('../../../config/db')
const { sendEmail, newOtp } = require('../../utils/mail/otp.mail')

// LOGIN CONTROLLER ------>

// const loginViaOtp = async (req, res) => {
//   const { email, companyId } = req.body

//   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())) {
//     return res.status(400).json({ error: 'Invalid email address' })
//   }

//   try {
//     let user
//     if (companyId) {
//       user = await prisma.user.findUnique({
//         where: {
//           email_companyId: {
//             email,
//             companyId,
//           },
//         },
//       })
//     } else {
//       user = await prisma.user.findFirst({
//         where: { email, role: 'SUPERADMIN' },
//       })
//     }

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }
//     // Generate OTP (6-digit)
//     const otp = newOtp()
//     const otpTimestamp = Date.now()
//     const otpExpiry = otpTimestamp + 10 * 60 * 1000

//     // Save OTP + expiry (5 min)
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         otp,
//         otpExpire: new Date(otpExpiry),
//       },
//     })

//     // Choose Template and send OTP
//     const templateType = 'newUserOtp'
//     await sendEmail(email, templateType, { otp, email })

//     console.log(`✅ OTP for ${email}: ${otp}`)

//     return res.status(200).json({
//       message: `OTP sent on ${email}. Please verify.`,
//     })
//     // return res.render('otp', {
//     //   emailSent: true,
//     //   email,
//     //   message: 'otp sent',
//     // })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Server error' })
//   }

//   // if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())) {
//   //   return res.status(400).json({ error: 'Invalid email address' })
//   // }

//   // try {
//   //   const user = await prisma.user.findUnique({ where: { email } })

//   //   if (!user) {
//   //     return res.status(404).json({ error: 'User not found' })
//   //   }

//   //   // Generate OTP (6-digit)
//   //   const otp = newOtp()
//   //   const otpTimestamp = Date.now()
//   //   const otpExpiry = otpTimestamp + 10 * 60 * 1000

//   //   // Save OTP + expiry (5 min)
//   //   await prisma.user.update({
//   //     where: { email },
//   //     data: {
//   //       otp,
//   //       otpExpire: new Date(otpExpiry),
//   //     },
//   //   })

//   //   // Choose Template and send OTP
//   //   const templateType = 'newUserOtp'
//   //   await sendEmail(email, templateType, { otp, email })

//   //   console.log(`✅ OTP for ${email}: ${otp}`)

//   //   return res.render('otp', {
//   //     emailSent: true,
//   //     email,
//   //     message: 'otp sent',
//   //   })
//   //   // .status(200).json({
//   //   //     message: "OTP sent to email. Please verify.",
//   //   //     email,
//   //   // });
//   // } catch (error) {
//   //   console.error(error)
//   //   return res.status(500).json({ error: 'Server error' })
//   // }
// }

// const verifyOtp = async (req, res) => {
//   const email = req.params.email || req.query.email
//   const otp = req.body.otp || req.query.otp
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email: String(email),
//       },
//     })
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     if (user.otp !== otp) {
//       return res.status(401).json({ error: 'Invalid OTP' })
//     }

//     if (new Date() > new Date(user.otpExpire)) {
//       return res.status(410).json({ error: 'OTP expired' })
//     }

//     console.log(user)

//     // clear OTP
//     await prisma.user.update({
//       where: { email },
//       data: { otp: null, otpExpire: null },
//     })

//     const refreshToken = jwt.sign(
//       {
//         userID: user.id,
//         email: user.email,
//         companyId: user.companyId,
//       },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: '90d' }
//     )

//     const accessToken = jwt.sign(
//       {
//         userID: user.id,
//         email: user.email,
//         companyId: user.companyId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     )

//     res
//       .cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         sameSite: 'strict',
//         maxAge: 90 * 24 * 60 * 60 * 1000,
//       })
//       .cookie('accessToken', accessToken, {
//         httpOnly: true,
//         sameSite: 'strict',
//         maxAge: 60 * 60 * 1000, // 1h
//       })

//     return res.status(200).json({
//       message: 'OTP verified successfully',
//       refreshToken,
//       accessToken,
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Server error fuck u bitch' })
//   }
// }

// const verifyTokenAndLoadAdmin = async (req, res) => {
//   const accessToken = req.cookies?.accessToken
//   console.log(accessToken)

//   if (!accessToken) {
//     return res.status(401).json({ message: 'No refresh token provided here' })
//   }

//   try {
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

//     console.log('Token Decode', decoded)

//     // FIX: use userID instead of id
//     const { userID, email, companyId } = decoded

//     const newAccessToken = jwt.sign({ userID, email, companyId }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     })

//     res.cookie('authToken', newAccessToken, {
//       httpOnly: true,
//       sameSite: 'strict',
//       maxAge: 60 * 60 * 1000, // 1h
//     })

//     return res.json({
//       message: 'Welcome to Admin Panel ✅',
//       authToken: newAccessToken,
//       refreshToken: req.cookies.refreshToken,
//     })
//   } catch (err) {
//     console.log('JWT Verify Error:', err.message)
//     return res.status(401).json({ error: 'Unauthorized access' })
//   }
// }

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

    // 1️⃣ Check if a SUPERADMIN already exists for this email
    const superAdmin = await prisma.user.findFirst({
      where: { email, role: 'SUPERADMIN' },
    })

    if (superAdmin && role !== 'SUPERADMIN') {
      return res.status(400).json({
        message:
          'This email is already a SUPERADMIN ❌. Cannot assign ADMIN/USER role in any company.',
      })
    }

    // 2️⃣ SUPERADMIN creation
    if (role === 'SUPERADMIN') {
      if (superAdmin) {
        return res.status(400).json({ message: 'SuperAdmin already exists ❌' })
      }

      const newSuperAdmin = await prisma.user.create({
        data: { email, name, role, companyId: null },
      })

      return res.status(201).json({
        message: 'SUPERADMIN created successfully ✅',
        user: newSuperAdmin,
      })
    }

    // 3️⃣ For ADMIN/USER → companyId required
    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required for ADMIN/USER ❌' })
    }

    // 4️⃣ Check if user already exists in this company
    const existingUser = await prisma.user.findUnique({
      where: { email_companyId: { email, companyId } },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in this company ❌' })
    }

    // 5️⃣ Check if company exists
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) return res.status(404).json({ message: 'Company not found ❌' })

    // 6️⃣ Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        company: { connect: { id: companyId } },
      },
    })

    return res.status(201).json({
      message: `${role} signed up successfully ✅`,
      user: newUser,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Failed to create user' })
  }
}

module.exports = { routingDashboard, signUp }
