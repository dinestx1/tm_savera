const { prisma } = require('../../../config/db')

const updateCompanyProject = async (req, res) => {
  const {
    budget,
    category,
    location,
    manager,
    client,
    aboutProject,
    description,
    CompletionDate,
    teamSize,
    status,
    milestones,
    keyFeatures,
    projectImage,
    projectVideo,
    project360,
    awards,
  } = req.body

  const { projectId } = req.params

  if (!projectId) {
    return res.status(400).json({ error: 'Project id is not recieved through url' })
  }

  const companyId = req.user?.companyId
  if (!companyId) {
    return res.status(400).json({ error: 'Company id is missing from token' })
  }
  try {
    // Check if the project exists and belongs to the company
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: companyId,
      },
    })

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found for this company' })
    }

    // Update the project with explicit fields only
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
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
        projectImage,
        projectVideo,
        project360,
        awards,
      },
    })
    console.log('Project Updated Successfully', updatedProject)
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { updateCompanyProject }
