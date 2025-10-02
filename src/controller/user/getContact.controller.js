const { prisma } = require('../../../config/db')

const getCompanyContact = async (req, res) => {
  const companyId = req.companyId

  try {
    const contacts = await prisma.contact.findFirst({
      where: {
        companyId: companyId,
      },
    })

    console.log(contacts)
    return res.status(200).json(contacts)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getCompanyContact }
