const { prisma } = require('../../../config/db')

const getCompany = async (req, res) => {
  const companyId = req.companyId
  console.log('CompanyId from middleware:', companyId)

  try {
    const companies = await prisma.company.findMany({
      where: { id: companyId },
    })
    res.status(200).json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getCompany }
