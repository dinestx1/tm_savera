const { prisma } = require('../../../config/db')

// GET COMPANY CONTROLLER ------>
const getCompany = async (req, res) => {
  try {
    const companies = await prisma.company.findMany()
    return res.status(200).json(companies)
  } catch (error) {
    console.error('Get companies error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getCompany }
