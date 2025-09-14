const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "utils/views"));


app.get('/', (req, res) => {
  try {
    const authToken = req.cookies.refreshToken;

    if (!authToken) {
      return res.status(401).json("Unauthorized Access 1");
    }

    const decodedToken = jwt.verify(authToken, process.env.JWT_REFRESH_SECRET);

    if (decodedToken) {
      return res.redirect(`http://localhost:8080/admin/dashboard`);
    } else {
      return res.status(401).json("Unauthorized Access 2");
    }
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json("Server: Unauthorized access");
  }
});


// Routes ----->
const { authRouter } = require('./routes/auth.routes')
const {companyRouter} = require('./routes/company.routes')
app.use("/", authRouter);
app.use("/company", companyRouter);

// Catch-all for invalid routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

module.exports = { app };
