const { prisma } = require('../../../config/db')

const updateSubsidiary = async (req, res) => {
  try {
    const parentCompanyId = req.user.companyId
    console.log('Parent CompanyId from token or body:', parentCompanyId)
    const {
      subsidiaryId,
      name,
      aboutUs,
      whatWeDo,
      establishmentYear,
      officeStaff,
      fieldWorker,
      projectCount,
    } = req.body

    // Validation
    if (!subsidiaryId || typeof subsidiaryId !== 'string') {
      return res.status(400).json({ error: 'subsidiaryId is required and must be a string' })
    }
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required and must be a string' })
    }
    if (!aboutUs || typeof aboutUs !== 'string') {
      return res.status(400).json({ error: 'aboutUs is required and must be a string' })
    }
    if (!whatWeDo || (typeof whatWeDo !== 'object' && typeof whatWeDo !== 'string')) {
      return res
        .status(400)
        .json({ error: 'whatWeDo is required and must be an object or JSON string' })
    }

    // Parse establishmentYear into a Date object
    const estYear = establishmentYear ? new Date(establishmentYear) : null
    if (!estYear || Number.isNaN(estYear.getTime())) {
      return res.status(400).json({
        error: 'establishmentYear is required and must be a valid date string (e.g. 2010-01-01)',
      })
    }
    if (!officeStaff || isNaN(Number(officeStaff))) {
      return res.status(400).json({ error: 'officeStaff is required and must be a number' })
    }
    if (!fieldWorker || isNaN(Number(fieldWorker))) {
      return res.status(400).json({ error: 'fieldWorker is required and must be a number' })
    }
    if (!projectCount || isNaN(Number(projectCount))) {
      return res.status(400).json({ error: 'projectCount is required and must be a number' })
    }
    if (!parentCompanyId) {
      return res.status(400).json({ error: 'parentCompanyId is required' })
    }
    // Parse whatWeDo if JSON string
    let whatWeDoParsed = typeof whatWeDo === 'string' ? JSON.parse(whatWeDo) : whatWeDo
    // ✅ Update subsidiary
    const updatedSubsidiary = await prisma.subsidiary.updateMany({
      where: {
        id: subsidiaryId,
        parentId: parentCompanyId, // Ensure it belongs to the parent company
      },
      data: {
        title: name,
        aboutUs,
        whatWeDO: whatWeDoParsed,
        establishmentYear: estYear,
        officeStaff: Number(officeStaff),
        fieldWorkers: Number(fieldWorker),
        projectsCount: Number(projectCount),
      },
    })
    if (updatedSubsidiary.count === 0) {
      return res
        .status(404)
        .json({ error: 'Subsidiary not found or does not belong to your company' })
    }
    return res.status(200).json({ message: 'Subsidiary updated successfully', updatedSubsidiary })
  } catch (error) {
    console.error('Error updating subsidiary:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { updateSubsidiary }
