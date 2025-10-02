const { prisma } = require('../../../config/db')

const getCompany = async (req, res) => {
  const companyId = req.companyId
  console.log('CompanyId from middleware:', companyId)

  try {
     const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        // Include only featured projects
        projects: {
          where: { featured: true },
        },
      },
    })
      if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }
    res.status(200).json(company)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}



module.exports = { getCompany }
