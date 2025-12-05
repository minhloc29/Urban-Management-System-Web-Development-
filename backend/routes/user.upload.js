const express = require('express');
const multer = require('multer');

const { uploadSingle } = require("../controllers/user.UploadController");
const storage = require("../config/gridfs");

const router = express.Router();
const upload = multer({ storage });

console.log("Going into user upload!")

router.post("/image", upload.single("image"), uploadSingle);
module.exports = router;
