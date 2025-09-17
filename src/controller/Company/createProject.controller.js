const { prisma } = require('../../../config/db')

const createProject = async (req, res) => {
  try {
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
      milestones,
      keyFeatures,
      projectImage,
      projectVideo,
      project360,
      awards,
    } = req.body

    const companyId = req.user.companyId
    console.log('User CompanyId from token:', companyId)

    // Basic validation
    if (
      !title ||
      !category ||
      !budget ||
      !manager ||
      !client ||
      !startDate ||
      !CompletionDate ||
      !location ||
      !status ||
      !companyId
    ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        category,
        budget: parseFloat(budget),
        manager,
        aboutProject,
        description,
        client,
        startDate: new Date(startDate),
        CompletionDate: new Date(CompletionDate),
        location,
        teamSize: teamSize ? parseInt(teamSize) : null,
        status,
        milestones,
        keyFeatures,
        projectImage,
        projectVideo,
        project360,
        awards, // 👈 JSON array of objects
        company: {
          connect: { id: companyId },
        },
      },
    })

    res.status(201).json({ message: 'Project created successfully', project })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { createProject }
