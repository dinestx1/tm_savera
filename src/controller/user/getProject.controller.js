const { prisma } = require('../../../config/db')

const getCompanyProject = async (req, res) => {
  try {
    const projects = await prisma.project.findMany()
    return res.status(200).json(projects)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getCompanyProject }
