const { prisma } = require('../../../config/db')

const createCompany = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body is required (Content-Type: application/json)',
      })
    }

    const {
      title,
      aboutUs,
      whatWeDO,
      establishementYear,
      officeStaff,
      fieldWorkers,
      projectsCount,
      parentId, // ✅ optional parent company ID
    } = req.body

    // --- Validations ---
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required and must be a string' })
    }

    const existedCompany = await prisma.company.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    })

    if (existedCompany) {
      return res.status(409).json({ error: 'A company with this title already exists ❌' })
    }

    if (!aboutUs || typeof aboutUs !== 'string') {
      return res.status(400).json({ error: 'aboutUs is required and must be a string' })
    }

    let whatWeDoParsed = null
    if (whatWeDO === undefined || whatWeDO === null) {
      return res.status(400).json({ error: 'whatWeDO is required (object)' })
    } else if (typeof whatWeDO === 'string') {
      try {
        whatWeDoParsed = JSON.parse(whatWeDO)
      } catch (err) {
        console.error('Invalid JSON for whatWeDO:', err)
        return res.status(400).json({ error: 'whatWeDO is a string but not valid JSON' })
      }
    } else if (typeof whatWeDO === 'object') {
      whatWeDoParsed = whatWeDO
    } else {
      return res.status(400).json({ error: 'whatWeDO must be an object or JSON string' })
    }

    const estYear = establishementYear ? new Date(establishementYear) : null
    if (!estYear || Number.isNaN(estYear.getTime())) {
      return res.status(400).json({
        error: 'establishementYear is required and must be a valid date string (e.g. 2010-01-01)',
      })
    }

    const officeStaffNum = Number(officeStaff)
    const fieldWorkersNum = Number(fieldWorkers)
    const projectsCountNum = Number(projectsCount)
    if (
      !Number.isFinite(officeStaffNum) ||
      !Number.isFinite(fieldWorkersNum) ||
      !Number.isFinite(projectsCountNum)
    ) {
      return res.status(400).json({
        error: 'officeStaff, fieldWorkers and projectsCount must be numeric values',
      })
    }

    // --- Optional parent validation ---
    let parentCompany = null
    if (parentId) {
      parentCompany = await prisma.company.findUnique({ where: { id: parentId } })
      if (!parentCompany) {
        return res.status(404).json({ error: 'Parent company not found ❌' })
      }
    }

    // --- Create company (with or without parent) ---
    const newCompany = await prisma.company.create({
      data: {
        title,
        aboutUs,
        whatWeDO: whatWeDoParsed,
        establishmentYear: estYear,
        officeStaff: officeStaffNum,
        fieldWorkers: fieldWorkersNum,
        projectsCount: projectsCountNum,
        ...(parentId && { parent: { connect: { id: parentId } } }), // ✅ attach parent if provided
      },
      include: {
        parent: true, // show parent details if exists
        children: true, // in case we later want to confirm hierarchy
      },
    })

    return res.status(201).json({
      message: parentId
        ? `Child company created under parent "${parentCompany?.title}" ✅`
        : 'Company created successfully ✅',
      company: newCompany,
    })
  } catch (error) {
    console.error('Error creating company:', error)

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Duplicate entry - unique constraint failed' })
    }

    return res.status(500).json({ error: 'Failed to create company' })
  }
}

module.exports = { createCompany }
