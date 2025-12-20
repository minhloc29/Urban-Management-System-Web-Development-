const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");
const fs = require("fs");

exports.enhanceDescriptionAI = async ({
  images,
  title,
  category,
  hint,
  language = "vi"
}) => {
  const formData = new FormData();

  images.forEach((img) => {
    formData.append(
      "file",
      fs.createReadStream(img.path),
      {
        filename: img.originalname,
        contentType: img.mimetype
      }
    );
  });

  if (title) formData.append("title", title);
  if (category) formData.append("category", category);
  if (hint) formData.append("hint", hint);
  formData.append("language", language);
  console.log("Check url: ", process.env.AI_SERVICE_URL)
  console.log("Check internal token: ", process.env.AI_INTERNAL_TOKEN)
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/v1/analyze-incident`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Internal-Token": process.env.AI_INTERNAL_TOKEN,
        "X-Request-ID": crypto.randomUUID()
      },
      timeout: 15000
    }
  );

  return response.data;
};


