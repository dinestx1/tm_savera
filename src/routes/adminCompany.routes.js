const express = require('express')
const { createCompany } = require('../controller/Company/createCompany.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { updateCompany } = require('../controller/Company/updateCompany.controller')
const { createCompanyContact } = require('../controller/Company/createContact.controller')
const { updateContact } = require('../controller/Company/updateContact.controller')
const { createProject } = require('../controller/Company/createProject.controller')
const { updateCompanyProject } = require('../controller/Company/updateProject.controller')

const adminCompanyRouter = express.Router()

adminCompanyRouter.post('/create-company-profile', createCompany) //Disable for time being

// Update Company About Us
// companyRouter.patch(
//   '/update-company-about-us',
//   authMiddleware.verifyAccessToken,
//   authMiddleware.companyVerification,
//   updateCompanyAbout
// )
adminCompanyRouter.patch(
  '/update-company',
  authMiddleware.verifyAccessToken,
  authMiddleware.companyVerification,
  updateCompany
) // ✅ Working fine

// Contact Details
adminCompanyRouter.post(
  '/create-contact',
  authMiddleware.verifyAccessToken,
  authMiddleware.companyVerification,
  createCompanyContact
) // ✅ Working fine
adminCompanyRouter.patch(
  '/update-contact',
  authMiddleware.verifyAccessToken,
  authMiddleware.companyVerification,
  updateContact
) // ✅ Working fine

// Projects (handled in project routes)
adminCompanyRouter.post(
  '/create-project',
  authMiddleware.verifyAccessToken,
  authMiddleware.companyVerification,
  createProject
)
adminCompanyRouter.patch(
  '/update-project/:projectId',
  authMiddleware.verifyAccessToken,
  authMiddleware.companyVerification,
  updateCompanyProject
)

module.exports = { adminCompanyRouter }
