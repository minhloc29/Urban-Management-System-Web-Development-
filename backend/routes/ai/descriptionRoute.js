const express = require('express');
const{enhanceDescriptionAI} = require("../../service/ai_service");
const upload = require("../../middleware/uploadMiddleware"); // Use uploadMiddleware

const router = express.Router();

router.post(
  "/enhance-description",
  upload.array("images", 5),
  async (req, res) => {
    try {
        console.log("Send to the route")
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required"
        });
      }
      console.log("Gonna check the result")
      const aiResult = await enhanceDescriptionAI({
        images: req.files,
        title: req.body.title,
        category: req.body.category,
        hint: req.body.hint,
        language: req.body.language
      });

      return res.json({
        success: true,
        data: aiResult
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "AI processing failed"
      });
    }
  }
);


module.exports = router;