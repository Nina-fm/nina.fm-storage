const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { log } = require("./lib/log");
const { uploadBasePath, upload } = require("./multer.config");

dotenv.config();

const PORT = process.env.PORT || 3000;
const PUBLIC_ENDPOINT = process.env.PUBLIC_ENDPOINT || "files";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/browse", (req, res) => {
  log("req.body", req.body);

  const bucket = "uploads";
  const dirPath = path.join(uploadBasePath, bucket);

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Failed to read directory" });
    }

    const fileList = files
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      .map((file) => ({
        filename: file,
        publicUrl: `${BASE_URL}/${PUBLIC_ENDPOINT}/${bucket}/${file}`,
      }));

    res.json(fileList);
  });
});

app.post("/api/upload", upload.single("file"), (req, res, next) => {
  log("req.body", req.body);
  log("req.file", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const baseUrl = `${BASE_URL}/${PUBLIC_ENDPOINT}`;

  res.status(201).json({
    bucket: req?.body?.bucket ?? "",
    filename: req.file.filename,
    originalname: req.file.originalname,
    publicUrl: `${baseUrl}/${req.body.bucket}/${req.file.filename}`,
  });
});

app.post("/api/delete", (req, res) => {
  log("req.body", req.body);

  if (!req.body || !req.body.filename) {
    return res.status(400).json({ error: "Bucket and filename are required" });
  }

  const filename = req.body.filename;
  const bucket = req.body?.bucket || "";

  const filePath = path.join(uploadBasePath, bucket, filename);

  // Check if the file exists
  fs.stat(filePath, (err) => {
    if (err) {
      console.error("Error checking file:", err);
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Failed to delete file" });
      }
      res.json({ message: "File deleted successfully" });
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/browse", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/browse.html"));
});
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/upload.html"));
});

// Set up static serving for the 'uploads' directory
app.use(`/${PUBLIC_ENDPOINT}`, express.static(uploadBasePath));

// Start the server
app.listen(PORT);

console.log("Nina.fm Storage API");
console.log(`Server is running on port ${PORT}`);
