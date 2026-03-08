const express = require("express")
const cors = require("cors")
const app = express()
const pool = require("./db")
// const PORT = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// routes
app.get("/videos3/songs", async (req, res) => {
    try {
        const allData = await pool.query("SELECT DISTINCT songname FROM videos3 ORDER BY songname");
        res.json(allData.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get("/videos3/:songname", async (req, res) => {
    try {
        const { songname } = req.params;
        const songnames = await pool.query("SELECT * FROM videos3 WHERE songname = $1 ORDER BY CASE row_position WHEN 'top' THEN 0 WHEN 'bot' THEN 1 ELSE 2 END, column_position", [songname]);
        res.json(songnames.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000")
});