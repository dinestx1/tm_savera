const { prisma } = require('../../../config/db')

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonials.findMany()
    res.status(200).json({ testimonials })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getTestimonials }
