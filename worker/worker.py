# Parts of this (c) Google Inc under Apache 2.0
# http://www.apache.org/licenses/LICENSE-2.0
# The other bits by Tom Grek, public domain, no warranty.

import asyncio
import io
import json

from mlq.queue import MLQ

import numpy as np
import tensorflow as tf
import tensorflowjs as tfjs
from tensorflow.keras.utils import get_file

mlq = MLQ('deploy_demo', 'localhost', 6379, 0)

model = tfjs.converters.load_keras_model('./model.json')
# Some bug in Keras necessitates the next line
model._make_predict_function()

path = get_file('nietzsche.txt', origin='https://s3.amazonaws.com/text-datasets/nietzsche.txt')
with io.open(path, encoding='utf-8') as f:
    text = f.read().lower()
print('corpus length:', len(text))
chars = sorted(list(set(text)))
print('total chars:', len(chars))
char_indices = dict((c, i) for i, c in enumerate(chars))
indices_char = dict((i, c) for i, c in enumerate(chars))

def sample(preds, temperature=1.0):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds) / temperature
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)
    probas = np.random.multinomial(1, preds, 1)
    return np.argmax(probas)

maxlen = 40
def inference(params_dict, *args):
    seed = params_dict['seed']
    seed = seed.lower()
    while len(seed) != maxlen:
        seed = ' ' + seed
    generated = seed
    for i in range(400):
        x_pred = np.zeros((1, maxlen, len(chars)))
        for t, char in enumerate(seed):
            x_pred[0, t, char_indices[char]] = 1.
        preds = model.predict(x_pred, verbose=0)[0]
        next_index = sample(preds, 1.0)
        next_char = indices_char[next_index]
        generated += next_char
        seed = seed[1:] + next_char
    return generated

def main():
    print("Running, waiting for messages.")
    async def doit():
        mlq.create_listener(inference)
    asyncio.get_event_loop().run_until_complete(doit())

if __name__ == '__main__':
    main()
