#Source: https://www.pyimagesearch.com/2017/03/20/imagenet-vggnet-resnet-inception-xception-keras/

from flask import Flask
from flask_cors import CORS
from flask import request
from flask import jsonify

from keras.applications import InceptionV3
from keras.applications import imagenet_utils
from keras.applications.inception_v3 import preprocess_input
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img
import numpy as np
import json

global model
model = InceptionV3()

app = Flask(__name__)
CORS(app)

def reshapeImage(img):
	preprocess = preprocess_input
	image = load_img(img, target_size=(299, 299))
	image = img_to_array(image)
	image = np.expand_dims(image, axis=0)
	image = preprocess(image)
	return image


def predict_image(image):
	preds = model.predict(image)
	P = imagenet_utils.decode_predictions(preds)
	p = []
	for (i, (_, label, prob)) in enumerate(P[0]):
		p.append({'label':label,'prob':prob*100})
	return p


@app.route('/inception/picture', methods=["POST"])
def predict():
    x = reshapeImage(request.files['img'])
    y = predict_image(x)
    return jsonify(y)
