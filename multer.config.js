const multer = require("multer");
const short = require("short-uuid");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const uploadBaseDir = process.env.PUBLIC_DIRNAME || "public";
const uploadBasePath = path.join(__dirname, uploadBaseDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("storage destination req.body", req.body);
    const uploadPath = path.join(uploadBasePath, req.body?.bucket ?? "");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${short.generate()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

module.exports = { upload, uploadBaseDir, uploadBasePath };
