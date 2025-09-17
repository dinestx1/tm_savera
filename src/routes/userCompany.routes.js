const express = require('express')
const { getCompany } = require('../controller/user/getCompany.controller')
const { getCompanyContact } = require('../controller/user/getContact.controller')
const { getCompanyProject } = require('../controller/user/getProject.controller')
const { createTestimonial } = require('../controller/user/createTestimonial.controller')
const { feedbackLimiter } = require('../middlewares/rateLimiter.middleware')
const { getTestimonials } = require('../controller/user/getTestimonial.controller')

const userCompanyRouter = express.Router()

userCompanyRouter.get('/get-company', getCompany)
userCompanyRouter.get('/get-contact', getCompanyContact)

// Get Project
userCompanyRouter.get('/get-project', getCompanyProject)
userCompanyRouter.get('/get-project/:projectId', getCompanyProject)

// Testimonials
userCompanyRouter.post('/post/testimonial', feedbackLimiter, createTestimonial)
userCompanyRouter.get('/get/testimonial', getTestimonials)

module.exports = { userCompanyRouter }
