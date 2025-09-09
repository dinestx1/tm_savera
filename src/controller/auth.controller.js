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
            .render("otp", {
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
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        if (user.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }


        if (new Date() > new Date(user.otpExpire)) {
            return res.status(410).json({ error: "OTP expired" });
        }

        // clear OTP
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpire: null },
        });

        const refreshToken = jwt.sign(
            { userID: user.id, email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "90d" }
        );

        const accessToken = jwt.sign(
            { userID: user.id, email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res
            // .redirect(`http://localhost:8080/dashboard/${token}`)
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 90 * 24 * 60 * 60 * 1000
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000 // 1h
            })
            .status(200).json({
                message: "OTP verified successfully",
                refreshToken,
                accessToken,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const verifyTokenAndLoadAdmin = async (req, res) => {
  const { refreshToken } = req.params;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // FIX: use userID instead of id
    const { userID, email } = decoded;

    const newAccessToken = jwt.sign(
      { userID, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1h
    });

    return res.json({
      message: "Welcome to Admin Panel ✅",
      authToken: newAccessToken,
    });
  } catch (err) {
    console.log("JWT Verify Error:", err.message);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};



const routingDashboard = async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        console.log("AuthToken:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded payload:", decoded);

        if (decode) {
            return res.redirect(`http://localhost:8080/dashboard/${token}`);
        } else {
            return console.log('Error')
        }
        // redirect with token in URL
    } catch (err) {
        console.error("JWT Error2:", err.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
}



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

module.exports = { loginViaOtp, verifyOtp, verifyTokenAndLoadAdmin, routingDashboard, signUp };
