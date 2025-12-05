exports.uploadSingle = async (req, res) => {
  try {

    console.log("Inside Upload Image");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: `${req.protocol}://${req.get("host")}/${file.path}`, // build URL
      },
    });
  } catch (error) {
    console.error("Upload  km. n:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
