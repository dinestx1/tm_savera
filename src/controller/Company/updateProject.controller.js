const { prisma } = require('../../../config/db')
const cloudinary = require('../../../config/cloudinaryConfig')

// Helper to upload single file to Cloudinary
const uploadFile = async (file, resourceType = 'image') => {
  if (!file) return null
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    { resource_type: resourceType }
  )
  return result.secure_url
}

// Handle multiple files array
const handleFiles = async (files, resourceType = 'image') => {
  if (!files || files.length === 0) return []
  const urls = []
  for (const file of files) {
    const url = await uploadFile(file, resourceType)
    if (url) urls.push(url)
  }
  return urls
}

const updateCompanyProject = async (req, res) => {
  try {
    const { projectId } = req.params
    if (!projectId) return res.status(400).json({ error: 'Project id is required in URL' })

    const companyId = req.user?.companyId
    if (!companyId) return res.status(400).json({ error: 'Company id is missing from token' })

    const {
      category,
      client,
      location,
      budget,
      manager,
      aboutProject,
      description,
      CompletionDate,
      teamSize,
      status,
      milestones,
      keyFeatures,
      awards,
      featured,
    } = req.body

    // Check if the project exists and belongs to the company
    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, companyId },
    })

    if (!existingProject)
      return res.status(404).json({ error: 'Project not found for this company' })

    // Upload files
    const projectImageURLs = await handleFiles(req.files?.projectImage, 'image')
    const projectVideoURLs = await handleFiles(req.files?.projectVideo, 'video')
    const project360URLs = await handleFiles(req.files?.project360, 'image')

    // Merge new uploads with existing files
    const updatedProjectData = {
      category: category || existingProject.category,
      client: client || existingProject.client,
      location: location || existingProject.location,
      budget: budget ? parseFloat(budget) : existingProject.budget,
      manager: manager || existingProject.manager,
      aboutProject: aboutProject || existingProject.aboutProject,
      description: description || existingProject.description,
      CompletionDate: CompletionDate ? new Date(CompletionDate) : existingProject.CompletionDate,
      teamSize: teamSize ? parseInt(teamSize) : existingProject.teamSize,
      status: status ? status.toUpperCase() : existingProject.status,
      milestones: milestones ? JSON.parse(milestones) : existingProject.milestones,
      keyFeatures: keyFeatures ? JSON.parse(keyFeatures) : existingProject.keyFeatures,
      awards: awards ? JSON.parse(awards) : existingProject.awards,
      featured: featured !== undefined ? !!featured : existingProject.featured,
      projectImage: [...existingProject.projectImage, ...projectImageURLs],
      projectVideo: [...existingProject.projectVideo, ...projectVideoURLs],
      project360: [...existingProject.project360, ...project360URLs],
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updatedProjectData,
    })

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Server error', details: error.message })
  }
}

module.exports = { updateCompanyProject }
