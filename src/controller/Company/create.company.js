const jwt = require("jsonwebtoken");
const { prisma } = require("../../../config/db");



const createCompany = async (req, res) => {
    try {
        // guard: ensure req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Request body is required (Content-Type: application/json)'
            });
        }

        // destructure safely
        const { title, aboutUs, whatWeDO, establishementYear, officeStaff, fieldWorkers, projectsCount } = req.body;

        // simple validation
        if (!title || typeof title !== 'string') {
            return res.status(400).json({
                error: 'title is required and must be a string'
            });
        }

        // Check the company name wheather it is exist or not
        const existedCompany = await prisma.company.findFirst({
            where: {
                title: {
                    equals: title,
                    mode: "insensitive"
                }
            }
        })

        if (!aboutUs || typeof aboutUs !== 'string') {
            return res.status(400).json({
                error: 'aboutUs is required and must be a string'
            });
        }

        // parse whatWeDO if user passes a stringified JSON
        let whatWeDoParsed = null;
        if (whatWeDO === undefined || whatWeDO === null) {

            return res.status(400).json({ error: 'whatWeDO is required (object)' });

        } else if (typeof whatWeDO === 'string') {

            try {
                whatWeDoParsed = JSON.parse(whatWeDO);
            } catch (err) {
                console.error('Invalid JSON for whatWeDO:', err);
                return res.status(400).json({ error: 'whatWeDO is a string but not valid JSON' });
            }

        } else if (typeof whatWeDO === 'object') {

            whatWeDoParsed = whatWeDO;

        } else {
            return res.status(400).json({ error: 'whatWeDO must be an object or JSON string' });
        }

        // parse and validate date
        const estYear = establishementYear ? new Date(establishementYear) : null;
        if (!estYear || Number.isNaN(estYear.getTime())) {
            return res.status(400).json({
                error: 'establishementYear is required and must be a valid date string (e.g. 2010-01-01)'
            });
        }

        // numbers
        const officeStaffNum = Number(officeStaff);
        const fieldWorkersNum = Number(fieldWorkers);
        const projectsCountNum = Number(projectsCount);
        if (!Number.isFinite(officeStaffNum) || !Number.isFinite(fieldWorkersNum) || !Number.isFinite(projectsCountNum)) {
            return res.status(400).json({
                error: 'officeStaff, fieldWorkers and projectsCount must be numeric values'
            });
        }


        // check duplicacy
        if (existedCompany) {
            return res.status(409).json({
                error: "A company with this title already exists ❌"
            });
        }

        // create company in DB
        const newCompany = await prisma.company.create({
            data: {
                title,
                aboutUs,
                whatWeDO: whatWeDoParsed,
                establishementYear: estYear,
                officeStaff: officeStaffNum,
                fieldWorkers: fieldWorkersNum,
                projectsCount: projectsCountNum
            }
        });

        return res.status(201).json({
            message: 'Company created successfully ✅',
            company: newCompany
        });

    } catch (error) {
        console.error('Error creating company:', error);

        // Prisma known error handling (example)
        if (error.code === 'P2002') { // unique constraint failed
            return res.status(409).json({
                error: 'Duplicate entry - unique constraint failed'
            });
        }

        return res.status(500).json({
            error: 'Failed to create company'
        });
    } finally {
        // optional: don't disconnect here if Prisma Client is shared across app lifetime.
        // await prisma.$disconnect();
    }
};

module.exports = { createCompany };
