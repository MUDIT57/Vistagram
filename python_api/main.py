from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
import base64
from io import BytesIO

app = FastAPI()

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

class ImageInput(BaseModel):
    image_url: str  # can be https:// URL or base64 data URL

@app.post("/caption")
async def generate_caption(data: ImageInput):
    try:
        # Check if input is base64 data URL
        if data.image_url.startswith("data:image"):
            header, base64_data = data.image_url.split(",", 1)
            image = Image.open(BytesIO(base64.b64decode(base64_data))).convert("RGB")
        else:
            # load from regular URL
            image = Image.open(requests.get(data.image_url, stream=True).raw).convert("RGB")

        # prepare input
        inputs = processor(images=image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        return {"caption": caption, "success": True}

    except Exception as e:
        return {"error": str(e), "success": False}
