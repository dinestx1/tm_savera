const jwt = require('jsonwebtoken')
const { prisma } = require('../../config/db')

const verifyCompanyViaUrl = async (req, res, next) => {
  try {
    const companyUrl = req.headers['x-company-url'] || req.query.companyUrl || req.body.companyUrl

    if (!companyUrl) {
      return res.status(400).json({ message: 'Company URL is required' })
    }
    const company = await prisma.company.findUnique({
      where: { url: companyUrl },
    })
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }
    req.companyId = company.id
    next()
  } catch (err) {
    console.error('Company verification error:', err)
    return res.status(500).json({ message: 'Server error during company verification' })
  }
}

module.exports = { verifyCompanyViaUrl }
