#Source: https://www.pyimagesearch.com/2017/03/20/imagenet-vggnet-resnet-inception-xception-keras/

from keras.applications import InceptionV3
from keras.applications import imagenet_utils
from keras.applications.inception_v3 import preprocess_input
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img
import numpy as np

global model
model = InceptionV3()

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

x = reshapeImage("test_picture.png")
print(predict_image(x))
