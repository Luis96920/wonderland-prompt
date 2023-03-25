import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
from flask import Flask, request, jsonify
from PIL import Image
from binascii import a2b_base64
import io

model_id = "timbrooks/instruct-pix2pix"
# device = "mps"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id, safety_checker=None)
# pipe.to(device)
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




@app.route("/iterate", methods=["POST"])
def predict():
    json = request.get_json()
    prompt = json["prompt"]
    img = json["img"]
    if img is None:
        return jsonify({"message": "No image"})
    if prompt is None:
        return jsonify({"message": "No prompt"})
    img = dataUriToImage(img)
    images = pipe(prompt, image=img, num_inference_steps=10, image_guidance_scale=1).images
    images[0].show()
    img.show()

    return jsonify({"img": "Done"})

    # prompt = "make him wear sunglasses"
    # images = pipe(prompt, image=image, num_inference_steps=10, image_guidance_scale=1).images

print("RUNNING")
app.run(host= '0.0.0.0', port="1978",debug=True)


