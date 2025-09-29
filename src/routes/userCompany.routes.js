const express = require('express')
const { getCompany } = require('../controller/user/getCompany.controller')
const { getCompanyContact } = require('../controller/user/getContact.controller')
const { getCompanyProject } = require('../controller/user/getProject.controller')
const { createTestimonial } = require('../controller/user/createTestimonial.controller')
const { feedbackLimiter } = require('../middlewares/rateLimiter.middleware')
const { getTestimonials } = require('../controller/user/getTestimonial.controller')
const companyMiddleware = require('../middlewares/company.middleware')

const userCompanyRouter = express.Router()

userCompanyRouter.get('/get-company', companyMiddleware.verifyCompanyViaUrl, getCompany)
userCompanyRouter.get('/get-contact', companyMiddleware.verifyCompanyViaUrl, getCompanyContact)

// Get Project
userCompanyRouter.get('/get-project', companyMiddleware.verifyCompanyViaUrl, getCompanyProject)
userCompanyRouter.get(
  '/get-project/:projectId',
  companyMiddleware.verifyCompanyViaUrl,
  getCompanyProject
)

// Testimonials
userCompanyRouter.post('/post/testimonial', feedbackLimiter, createTestimonial)
userCompanyRouter.get('/get/testimonial', getTestimonials)

module.exports = { userCompanyRouter }
