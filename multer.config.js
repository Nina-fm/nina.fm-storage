const multer = require("multer");
const short = require("short-uuid");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const { log } = require("./lib/log");

dotenv.config();

const uploadBaseDir = process.env.UPLOAD_PATH || "public";
const uploadBasePath = path.resolve(uploadBaseDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    log("storage destination req.body", req.body);
    const uploadPath = req.body?.bucket
      ? path.join(uploadBasePath, req.body.bucket)
      : uploadBasePath;
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
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, WEBP and SVG are allowed."
        )
      );
    }
  },
});

module.exports = { upload, uploadBaseDir, uploadBasePath };
