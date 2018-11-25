import * as tf from '@tensorflow/tfjs';

import {TextData} from './data';
import {LSTMTextGenerator} from './index';

import charset from './charset.js';
const chars = JSON.parse(charset.char_indices);

const generateTextButton = document.getElementById('generate-local');
const generateRemoteButton = document.getElementById('generate-text');
const waitMessage = document.getElementById('waitMessage');
const seedInput = document.getElementById('seedTextInput');

let textData;
let textGenerator;
const seedDefault = 'the thing you have to know about nietzch';

async function generateText() {
  let seedSentenceIndices;
  let seedSentence = seedInput.value;
  if (!seedSentence) {
    seedSentence = seedDefault;
    seedInput.value = seedSentence;
  }
  // minimum 40 char seed
  while (seedSentence.length < 40) {
    seedSentence = ' ' + seedSentence;
  }
  // also maximum 40 char seed
  seedSentence = seedSentence.substr(0, 40);
  seedSentenceIndices = textData.textToIndices(seedSentence);
  // generate 400 chars at temperature 1.0
  const sentence = await textGenerator.generateText(seedSentenceIndices, 400, 1.0);
  generatedTextInput.value = seedSentence + sentence;
}

export async function setUpUI() {
  textData = new TextData('some_nietzche_text', '', 40, 3);
  textData.charSet_ = Object.keys(chars).sort();
  textData.charSetSize_ = textData.charSet_.length;
  textGenerator = new LSTMTextGenerator(textData);
  await textGenerator.createModel();

  generateRemoteButton.addEventListener('click', async () => {
    let seedSentenceIndices;
    let seedSentence = seedInput.value;
    if (!seedSentence) {
      seedSentence = seedDefault;
      seedInput.value = seedSentence;
    }
    while (seedSentence.length < 40) {
      seedSentence = ' ' + seedSentence;
    }
    waitMessage.innerText = 'Enqueueing message';
    let id;
    setTimeout(async () => {
      id = await fetch('https://exploitip.com/api/enqueue?seed=' + encodeURIComponent(seedSentence)).then(r => r.text());
      waitMessage.innerText = 'Enqueued message with id: ' + id;
      status = '[queued; not started]'; // realistic msg from MLQ
      const progressChecker = async () => {
        // check every second til complete
        status = await fetch('https://exploitip.com/api/check_progress/' + id).then(r => r.text());
        if (status !== '[completed]') {
          if (status === '[failed]') {
            waitMessage.innerText = 'Backend said this failed. Sorry :('
          } else {
            setTimeout(progressChecker, 1000);
          }
        } else {
          let result = await fetch('https://exploitip.com/api/result/' + id).then(r => r.text());
          waitMessage.innerText = 'Done generating at the backend.';
          generatedTextInput.value = result;
        }
      };
      setTimeout(progressChecker, 1000);
    }, 0);
  });

  generateTextButton.addEventListener('click', async () => {
    waitMessage.innerText = 'Please wait a sec, generating locally.'
    setTimeout(async () => {
      await generateText();
      waitMessage.innerText = 'Done generating locally.';
    }, 0);
  });
}
