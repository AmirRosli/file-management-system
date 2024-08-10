require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Set up neondb
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Storage configuration for uploade files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// CRUD Endpoints //

// Upload new file
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded.");

        // Store file metadata in the database
        const result = await pool.query(
            "INSERT INTO files (filename, filedata) VALUES ($1, $2) RETURNING *",
            [file.originalname, fs.readFileSync(path.join("uploads", file.filename))]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Fetch all files
app.get("/api/files", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Fetch a specific file by id
app.get("/api/files/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);

        if (result.rows.length === 0) return res.status(404).send("File not found.");

        const file = result.rows[0];
        res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
        res.send(file.filedata);
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete a file
app.delete("/api/files/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM files WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) return res.status(404).send("File not found.");

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Update (replace new file / update new name of old file)
app.put("/api/files/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        const { filename } = req.body;

        const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send("File not found.");

        const oldFile = result.rows[0];
        const oldFilePath = path.join("uploads", oldFile.filename);

        if (file) {
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            const newFilePath = path.join("uploads", filename || oldFile.filename);
            fs.renameSync(file.path, newFilePath);

            const updateResult = await pool.query(
                "UPDATE files SET filename = $1 WHERE id = $2 RETURNING *",
                [filename || oldFile.filename, id]
            );

            res.json(updateResult.rows[0]);
        } else if (filename) {
            const newFilePath = path.join("uploads", filename);
            if (fs.existsSync(oldFilePath)) {
                fs.renameSync(oldFilePath, newFilePath);
            }

            const updateResult = await pool.query(
                "UPDATE files SET filename = $1 WHERE id = $2 RETURNING *",
                [filename, id]
            );

            res.json(updateResult.rows[0]);
        } else {
            res.status(400).send("No file or filename provided for update.");
        }
    } catch (error) {
        console.error("Error during file update:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});






app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});