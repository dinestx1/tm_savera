const { prisma } = require('../../../config/db')

const createTestimonial = async (req, res) => {
  const { name, companyName, email, contactNo, feedback, rating, photo } = req.body

  try {
    if (!name || !companyName || !feedback || !rating || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }
    if (contactNo && !/^\d{10,15}$/.test(contactNo.toString())) {
      return res.status(400).json({ error: 'Invalid contact number' })
    }
    const lowerCaseEmail = String(email).toLowerCase()
    const newTestimonial = await prisma.testimonials.create({
      data: {
        clientName: name,
        companyName,
        email: lowerCaseEmail,
        contactNo: contactNo ? contactNo.toString() : null,
        feedback,
        rating,
        photo,
      },
    })
    res
      .status(201)
      .json({ message: 'Testimonial created successfully', testimonial: newTestimonial })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createTestimonial }
