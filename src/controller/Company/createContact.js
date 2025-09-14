const jwt = require("jsonwebtoken");
const { prisma } = require("../../../config/db");



const createCompanyContact = async (req, res) => {
    const { companyId, phone, email, address, openOfficeTime } = req.body;
    console.log(companyId); // Debug

    if (!companyId) {
        return res.status(404).json("company Id not founded")
    }

    await prisma.contact.create({
        data: {
            phone,
            email,
            address,
            openOfficeTime,
            location,
            company: {
                connect: { id: companyId } // ✅ link user to existing company
            }
        }
    })
}


module.exports={createCompanyContact};
