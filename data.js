// This is taken verbatim from Tensorflow's sample RNN; see Google's license elsewhere.

import * as tf from '@tensorflow/tfjs';

export class TextData {

  constructor(dataIdentifier, textString, sampleLen, sampleStep) {

    this.dataIdentifier_ = dataIdentifier;

    this.textString_ = textString;
    this.textLen_ = textString.length;
    this.sampleLen_ = sampleLen;

    this.getCharSet_();
  }

  dataIdentifier() {
    return this.dataIdentifier_;
  }

  textLen() {
    return this.textLen_;
  }
  sampleLen() {
    return this.sampleLen_;
  }
  charSetSize() {
    return this.charSetSize_;
  }
  getFromCharSet(index) {
    return this.charSet_[index];
  }
  textToIndices(text) {
    const indices = [];
    for (let i = 0; i < text.length; ++i) {
      indices.push(this.charSet_.indexOf(text[i]));
    }
    return indices;
  }

  getRandomSlice() {
    const startIndex =
        Math.round(Math.random() * (this.textLen_ - this.sampleLen_ - 1));
    const textSlice = this.slice_(startIndex, startIndex + this.sampleLen_);
    return [textSlice, this.textToIndices(textSlice)];
  }
  getCharSet_() {
    this.charSet_ = [];
    for (let i = 0; i < this.textLen_; ++i) {
      if (this.charSet_.indexOf(this.textString_[i]) === -1) {
        this.charSet_.push(this.textString_[i]);
      }
    }
    this.charSetSize_ = this.charSet_.length;
  }
}
