import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
from flask import Flask, request, jsonify


model_id = "timbrooks/instruct-pix2pix"
device = "mps"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id, safety_checker=None)
pipe.to(device)
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)

URL = "https://raw.githubusercontent.com/timothybrooks/instruct-pix2pix/main/imgs/example.jpg"
def download_image(url):
    image = PIL.Image.open(requests.get(url, stream=True).raw)
    image = PIL.ImageOps.exif_transpose(image)
    image = image.convert("RGB")
    return image
image = download_image(URL)

print("Image:")

# print("MADE IT")
# images[0].show()
app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello():
    return "Welcome to our python server"

@app.route("/iterate", methods=["POST"])
def predict(req):
    json = req.get_json()
    return jsonify({"prompt": json["prompt"]})
    # prompt = "make him wear sunglasses"
    # images = pipe(prompt, image=image, num_inference_steps=10, image_guidance_scale=1).images

print("RUNNING")
app.run(host= '0.0.0.0', port="1978",debug=True)


