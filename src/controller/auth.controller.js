const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/db");

const loginViaOtp = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate OTP (6-digit)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP + expiry (5 min)
        await prisma.user.update({
            where: { email },
            data: {
                otp,
                otpExpire: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        // TODO: send OTP via email/SMS
        console.log(`✅ OTP for ${email}: ${otp}`);

        return res
        .render("otp",{
            emailSent: true,
            email,
            message: "otp sent"
        })
        // .status(200).json({
        //     message: "OTP sent to email. Please verify.",
        //     email,
        // });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const verifyOtp = async (req, res) => {
    const { email } = req.params;
    const { otp } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: String(email)
            }
        });

        console.log(user)

        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp) return res.status(401).json({ error: "Invalid OTP" });

        if (new Date() > new Date(user.otpExpire)) {
            return res.status(410).json({ error: "OTP expired" });
        }

        // clear OTP
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpire: null },
        });

        const token = jwt.sign(
            { userID: user.id, email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res
        .redirect(`http://localhost:8080/${token}`)
        // .status(200).json({
        //     message: "OTP verified successfully",
        //     token,
        // });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const verifyTokenAndLoadAdmin = (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.send("Welcome to Admin Panel ✅");
    } catch (err) {
        return res.status(401).send("Unauthorized access");
    }
};


// SIGN UP CONTROLLER ------>
const signUp = async (req, res) => {
    const { email, name, role } = req.body;

    try {
        // check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                role,
            },
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { loginViaOtp, verifyOtp, verifyTokenAndLoadAdmin, signUp };
