const { prisma } = require('../../../config/db')

const getCompanyContact = async (req, res) => {
  try {
    const contact = await prisma.contact.findMany()
    console.log(contact)
    return res.status(200).json(contact)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getCompanyContact }
