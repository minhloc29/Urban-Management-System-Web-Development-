const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const storage = new GridFsStorage({
  db: mongoose.connection,   // <--- IMPORTANT: use existing connection!
  file: (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = [".png", ".jpeg", ".jpg"];

    if (!allowedExt.includes(ext)) return null;

    return {
      bucketName: "uploads",
      filename: Date.now() + "-" + file.originalname.replace(/\s+/g, "")
    };
  }
});

module.exports = storage;
