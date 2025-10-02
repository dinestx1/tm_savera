const { prisma } = require('../../../config/db')

const getCompanyProject = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { companyId: req.companyId },
    })
    return res.status(200).json(projects)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params; // assuming projectId comes from route params

    const project = await prisma.project.findUnique({
      where: { id: projectId }, // projectId should match the primary key
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getCompanyProject,getProjectById }
