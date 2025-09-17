const { prisma } = require('../../../config/db')

const createCompanyContact = async (req, res) => {
  const { phone, email, address, location, openOfficeTime, socialMedia } = req.body

  const CompanyId = req.user.companyId
  console.log('User CompanyId from token:', CompanyId)

  try {
    // Validate phone
    if (!phone || !/^\d{10,15}$/.test(phone.toString())) {
      return res.status(400).json({ error: 'Invalid phone number' })
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Validate address
    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(400).json({ error: 'Address is required and must be a non-empty string' })
    }

    // Validate location
    if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
      return res.status(400).json({ error: 'Location must be a non-empty string if provided' })
    }

    // Validate openOfficeTime
    let openOfficeTimeParsed = null
    if (openOfficeTime !== undefined) {
      if (typeof openOfficeTime === 'string') {
        try {
          openOfficeTimeParsed = JSON.parse(openOfficeTime)
        } catch (err) {
          console.error('Invalid JSON for openOfficeTime:', err)
          return res.status(400).json({ error: 'openOfficeTime is a string but not valid JSON' })
        }
      } else if (typeof openOfficeTime === 'object') {
        openOfficeTimeParsed = openOfficeTime
      } else {
        return res
          .status(400)
          .json({ error: 'openOfficeTime must be an object or JSON string if provided' })
      }
    }

    // Create contact
    const newContact = await prisma.contact.create({
      data: {
        phone: phone.toString(), // store as string to avoid BigInt issues
        email,
        address,
        location,
        openOfficeTime: openOfficeTimeParsed,
        socialMedia,
        company: {
          connect: { id: CompanyId },
        },
      },
    })

    res.status(201).json({
      message: '✅ Contact created successfully',
      contact: newContact,
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { createCompanyContact }
