const { prisma } = require("../../../config/db");

// Update company (everything except title)
const updateCompany = async (req, res) => {
    try {


        // companyId comes from JWT (set in verifyAccessToken middleware)
        // const companyId = req.user.companyId;

        const { companyId, aboutUs, whatWeDO, establishementYear, officeStaff, fieldWorkers, projectsCount } = req.body;

        // Build update data object dynamically
        const updateData = {};

        if(!companyId){
            return res.status(404).json({err: "Id not found"})
        }

        if (aboutUs !== undefined) {
            if (typeof aboutUs !== "string") {
                return res.status(400).json({ error: "aboutUs must be a string" });
            }
            updateData.aboutUs = aboutUs;
        }

        if (whatWeDO !== undefined) {
            if (typeof whatWeDO === "string") {
                try {
                    updateData.whatWeDO = JSON.parse(whatWeDO);
                } catch (err) {
                    return res.status(400).json({ error: "Invalid JSON for whatWeDO" });
                }
            } else if (typeof whatWeDO === "object") {
                updateData.whatWeDO = whatWeDO;
            } else {
                return res.status(400).json({ error: "whatWeDO must be an object or JSON string" });
            }
        }

        if (establishementYear !== undefined) {
            const estYear = new Date(establishementYear);
            if (Number.isNaN(estYear.getTime())) {
                return res.status(400).json({ error: "Invalid establishementYear date" });
            }
            updateData.establishementYear = estYear;
        }

        if (officeStaff !== undefined) {
            const officeStaffNum = Number(officeStaff);
            if (!Number.isFinite(officeStaffNum)) {
                return res.status(400).json({ error: "officeStaff must be a number" });
            }
            updateData.officeStaff = officeStaffNum;
        }

        if (fieldWorkers !== undefined) {
            const fieldWorkersNum = Number(fieldWorkers);
            if (!Number.isFinite(fieldWorkersNum)) {
                return res.status(400).json({ error: "fieldWorkers must be a number" });
            }
            updateData.fieldWorkers = fieldWorkersNum;
        }

        if (projectsCount !== undefined) {
            const projectsCountNum = Number(projectsCount);
            if (!Number.isFinite(projectsCountNum)) {
                return res.status(400).json({ error: "projectsCount must be a number" });
            }
            updateData.projectsCount = projectsCountNum;
        }

        // If no fields provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        // Perform update
        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: updateData
        });

        res.json({
            message: "✅ Company updated successfully",
            company: updatedCompany
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        res.status(500).json({ error: "Failed to update company" });
    }
};

module.exports = { updateCompany };
