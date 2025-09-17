const { prisma } = require('../../../config/db')

const updateContact = async (req, res) => {
  const { phone, email, address, location, openOfficeTime, contactId, socialMedia } = req.body
  const companyId = req.user?.companyId

  try {
    // Validate contact id
    if (!contactId) {
      return res.status(400).json({ error: 'Contact id is required for update' })
    }

    // Validate phone
    if (!phone || !/^\d{10,15}$/.test(phone.toString())) {
      return res.status(400).json({ error: 'Invalid phone number' })
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email address' })
    }
    const lowerCaseEmail = String(email).toLowerCase()

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
          console.log('Invalid JSON for openOfficeTime:', err)
          return res.status(400).json({ error: 'openOfficeTime is a string but not valid JSON' })
        }
      } else if (typeof openOfficeTime === 'object') {
        openOfficeTimeParsed = openOfficeTime
      } else {
        return res.status(400).json({
          error: 'openOfficeTime must be an object or JSON string if provided',
        })
      }
    }

    // Ensure contact exists & belongs to company
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!existingContact) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    if (companyId && existingContact.companyId !== companyId) {
      return res.status(403).json({ error: 'You are not authorized to update this contact' })
    }

    // Update contact
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        phone: phone.toString(),
        email: lowerCaseEmail,
        address,
        location,
        openOfficeTime: openOfficeTimeParsed,
        socialMedia,
        ...(companyId && {
          company: {
            connect: { id: companyId },
          },
        }),
      },
    })

    return res.status(200).json({
      message: '✅ Contact updated successfully',
      contact: updatedContact,
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { updateContact }
