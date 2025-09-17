const { prisma } = require('../../../config/db')

const getCompany = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        services: true,
        users: true,
        contacts: true,
        projects: true,
        testimonials: true,
      },
    })
    res.status(200).json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getCompany }
