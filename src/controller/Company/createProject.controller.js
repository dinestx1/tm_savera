// controllers/Company/createProject.controller.js
const { prisma } = require('../../../config/db')
const cloudinary = require('../../../config/cloudinaryConfig')

// Upload single file to Cloudinary
const uploadFile = async (file, resourceType = 'image') => {
  if (!file) return null
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    { resource_type: resourceType }
  )
  return result.secure_url
}

// Handle multiple files (returns array of URLs)
const handleFiles = async (files, resourceType = 'image') => {
  if (!files || files.length === 0) return []
  const urls = []
  for (const file of files) {
    const url = await uploadFile(file, resourceType)
    if (url) urls.push(url)
  }
  return urls
}

const createProject = async (req, res) => {
  try {
    const companyId = req.user?.companyId || req.body.companyId
    if (!companyId) return res.status(400).json({ error: 'CompanyId is required' })

    const {
      title,
      category,
      budget,
      manager,
      aboutProject,
      description,
      client,
      startDate,
      CompletionDate,
      location,
      teamSize,
      status,
      featured,
      milestones,
      keyFeatures,
      awards,
    } = req.body

    // Validate required fields
    if (!title || !category || !manager || !status || !aboutProject || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Upload files
    const projectImageURLs = await handleFiles(req.files?.projectImage, 'image')
    const projectVideoURLs = await handleFiles(req.files?.projectVideo, 'video')
    const project360URLs = await handleFiles(req.files?.project360, 'image')

    // Convert fields
    const featuredFlag = !!featured

    let milestonesJson = []
    try {
      milestonesJson = milestones ? JSON.parse(milestones) : []
    } catch {
      milestonesJson = []
    }

    let keyFeaturesArray = []
    try {
      keyFeaturesArray = keyFeatures ? JSON.parse(keyFeatures) : []
    } catch {
      keyFeaturesArray = []
    }

    let awardsJson = []
    try {
      awardsJson = awards ? JSON.parse(awards) : []
    } catch {
      awardsJson = []
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        category,
        budget: budget ? parseFloat(budget) : null,
        manager,
        aboutProject,
        description,
        client: client || null,
        startDate: startDate ? new Date(startDate) : null,
        CompletionDate: CompletionDate ? new Date(CompletionDate) : null,
        location: location || null,
        teamSize: teamSize ? parseInt(teamSize) : null,
        status: status.toUpperCase(),
        featured: featuredFlag,
        milestones: milestonesJson,
        keyFeatures: keyFeaturesArray,
        projectImage: projectImageURLs,
        projectVideo: projectVideoURLs,
        project360: project360URLs,
        awards: awardsJson,
        companyId,
      },
    })

    return res.status(201).json({ message: 'Project created successfully', project })
  } catch (error) {
    console.error('Error creating project:', error)
    return res.status(500).json({ error: 'Server error', details: error.message })
  }
}

module.exports = { createProject }
