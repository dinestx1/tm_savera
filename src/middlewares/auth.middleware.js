const jwt = require('jsonwebtoken')
const { prisma } = require('../../config/db')

const verifyAccessToken = async (req, res, next) => {
  const token = req.cookies?.accessToken
  console.log('Token from cookie:', token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No Token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    console.log('Decoded JWT:', decoded)

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userID },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // If SUPERADMIN → full access
    if (user.role === 'SUPERADMIN') {
      console.log('Access granted: SUPERADMIN ✅')
      return next()
    }

    // If ADMIN → only allow within their own company
    if (user.role === 'ADMIN') {
      if (req.params.companyId && req.params.companyId !== user.companyId) {
        return res.status(403).json({
          message: 'Forbidden - Admins can only manage their own company 🚫',
        })
      }

      console.log('Access granted: ADMIN for company', user.companyId)
      req.companyId = user.companyId
      return next()
    }

    // If not ADMIN or SUPERADMIN → forbidden
    return res.status(403).json({ message: 'Forbidden - Insufficient role 🚫' })
  } catch (err) {
    console.error('JWT Verify Error:', err)
    return res.status(403).json({ message: 'Unauthorized - Invalid/Expired Token' })
  }
}

const companyVerification = async (req, res, next) => {
  try {
    const userCompanyId = req.user.companyId

    if (!userCompanyId) {
      return res.status(400).json({ message: 'No companyId in token' })
    }

    // Attach to request for later use in controllers
    req.companyId = userCompanyId

    next()
  } catch (err) {
    console.error('Company verification error:', err)
    return res.status(500).json({ message: 'Server error during company verification' })
  }
}

module.exports = { verifyAccessToken, companyVerification }
