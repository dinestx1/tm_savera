const express = require('express')
const cors = require('cors')
const { authRouter } = require('./routes/auth.routes')
const path = require('path')

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "utils/views"));


app.get('/', (req, res) => {
    return res.status(401).send("Unauthorized access");

});

// Routes ----->
app.use("/", authRouter);

// Catch-all for invalid routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

module.exports = { app };
