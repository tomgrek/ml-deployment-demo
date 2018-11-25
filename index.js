import * as tf from '@tensorflow/tfjs';

import {onTextGenerationChar, onTrainBatchEnd, onTrainBegin, onTrainEpochEnd, setUpUI} from './ui';
import {sample} from './utils';

export class LSTMTextGenerator {
  constructor(textData) {
    this.textData_ = textData;
    this.charSetSize_ = textData.charSetSize();
    this.sampleLen_ = textData.sampleLen();
    this.textLen_ = textData.textLen();
  }

  async createModel(lstmLayerSizes) {
    this.model = await tf.loadModel('https://exploitip.com/model.json');
    const waitMessage = document.getElementById('waitMessage');
    waitMessage.innerText = '';
  }

  async generateText(sentenceIndices, length, temperature) {
    const temperatureScalar = tf.scalar(temperature);

    let generated = '';
    let char = 1;
    while (generated.length < 400) {
      const inputBuffer =
          new tf.TensorBuffer([1, this.sampleLen_, this.charSetSize_]);
      for (let i = 0; i < this.sampleLen_; ++i) {
        inputBuffer.set(1, 0, i, sentenceIndices[i]);
      }
      const input = inputBuffer.toTensor();
      const output = this.model.predict(input);
      const winnerIndex = sample(tf.squeeze(output), temperatureScalar);
      const winnerChar = this.textData_.getFromCharSet(winnerIndex);

      generated += winnerChar;
      sentenceIndices = sentenceIndices.slice(1);
      sentenceIndices.push(winnerIndex);
      char = winnerIndex;
      input.dispose();
      output.dispose();
    }
    temperatureScalar.dispose();
    return generated;
  }
};

setUpUI();
