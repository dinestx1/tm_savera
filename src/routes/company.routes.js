const express = require('express')
const { createCompany } = require('../controller/Company/create.company')
const { updateCompanyAbout } = require('../controller/Company/updateAboutUs')
const authMiddleware = require('../middlewares/auth.middleware');
const { updateCompany } = require('../controller/Company/updateCompany');
const { createCompanyContact } = require('../controller/Company/createContact');

const companyRouter = express.Router();


companyRouter.post(
    "/create-company-profile",
    createCompany
)


// Update Company About Us
companyRouter.patch(
    "/update-company-about-us",
    authMiddleware.verifyAccessToken,
    authMiddleware.companyVerification,
    updateCompanyAbout
)
companyRouter.patch(
    "/update-company",
    // authMiddleware.verifyAccessToken,
    // authMiddleware.companyVerification,
    updateCompany
)

// Contact Details
companyRouter.post(
    "/create-contact",
    createCompanyContact
)

module.exports = { companyRouter }
