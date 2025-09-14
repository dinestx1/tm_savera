const jwt = require("jsonwebtoken");
const { prisma } = require("../../../config/db");


const updateCompanyAbout = async (req, res) => {
    try {
        const { aboutUs, companyId } = req.body;

        if (!aboutUs) {
            return res.status(400).json({ error: "aboutUs field is required" });
        }

        // companyId comes from JWT (set in verifyAccessToken)
        // const companyId = req.user.companyId;

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: { aboutUs }
        });

        res.json({
            message: "✅ Company details updated successfully",
            company: updatedCompany
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        res.status(500).json({ error: "Failed to update company details" });
    }
};


module.exports = { updateCompanyAbout }
