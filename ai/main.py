from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
import os
import tempfile

# Load env variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_INTERNAL_TOKEN = os.getenv("AI_INTERNAL_TOKEN")

if not GEMINI_API_KEY or not AI_INTERNAL_TOKEN:
    raise RuntimeError("Missing required environment variables")

# Init Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="Incident AI Service")

# CORS (frontend should NOT call this directly in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/v1/analyze-incident")
async def analyze_incident(
    file: UploadFile = File(...),
    x_internal_token: str = Header(None)
):
    # 🔐 Internal authentication
    if x_internal_token != AI_INTERNAL_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized internal request")

    # Validate file
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Upload image to Gemini
        uploaded_file = client.files.upload(file=tmp_path)

        # Run multimodal inference
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                uploaded_file,
                "Hãy mô tả sự cố trong ảnh bằng tiếng Việt, dưới 20 từ."
            ],
        )

        return {
            "success": True,
            "data": {
                "description": response.text.strip()
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}"
        )

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)



# curl -X POST https://urban-management-system-web-development-ov9d.onrender.com/v1/analyze-incident \
#   -H "Content-Type: multipart/form-data" \
#   -H "X-Internal-Token: your_internal_token_here" \
#   -F "file=@path/to/image.png"