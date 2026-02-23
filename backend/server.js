const express = require("express")
const cors = require("cors")
const app = express()
const pool = require("./db")
// const dotenv = require("dotenv")
// dotenv.config();
// const PORT = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// routes
app.get("/videos", async (req, res) => {
    try {
        const allData = await pool.query("SELECT * FROM videos");
        res.json(allData.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/videos/:songname", async (req, res) => {
    try {
        const { songname } = req.params;
        const songnames = await pool.query("SELECT * FROM videos WHERE songname = $1", [songname]);
        res.json(songnames.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000")
});