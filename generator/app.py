import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
from flask import Flask, request, jsonify, abort
from PIL import Image
from binascii import a2b_base64
import io
import base64
import io
from PIL import Image
import time


def pillow_image_to_base64_string(img):
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

model_id = "timbrooks/instruct-pix2pix"
device = "mps"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id, safety_checker=None)
pipe.to(device)
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)



print("Image:")

# print("MADE IT")
# images[0].show()
app = Flask(__name__)

def dataUriToImage(dataUri: str):
    data = dataUri.split(",")[1]
    data = a2b_base64(data)
    image = Image.open(io.BytesIO(data))
    image = image.convert("RGB")
    image = image.resize((512, 512))

    return image


@app.route("/", methods=["GET"])
def hello():
    return "Welcome to our python server"


def addWatermark(image):
    watermark = Image.open("img.png")
    watermark = watermark.resize((64, 64))
   
    image.paste(watermark, (512-64-4, 4), watermark)
    return image

@app.route("/iterate", methods=["POST"])
def predict():
    json = request.get_json()
    prompt = json["prompt"]
    img = json["img"]
    if img is None:
        abort(500)
    if prompt is None:
        abort(500)

    img = dataUriToImage(img)
    images = pipe(prompt, image=img, num_inference_steps=10, image_guidance_scale=1).images


    images[0].save(f"out/output_{time.time()}.png")
    # img.show()
    # images[0].show()

    # return img data url
   # img = addWatermark(images[0])
    return 'data:image/jpeg;base64,'+pillow_image_to_base64_string(images[0])

    
    # prompt = "make him wear sunglasses"
    # images = pipe(prompt, image=image, num_inference_steps=10, image_guidance_scale=1).images

print("RUNNING")
app.run(host= '0.0.0.0', port="1978",debug=True)


