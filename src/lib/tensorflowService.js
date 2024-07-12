import * as tf from '@tensorflow/tfjs';

class TensorflowService {
  constructor() {
    this.model = null;
  }

  async loadModel(modelUrl) {
    try {
      this.model = await tf.loadLayersModel(modelUrl);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading the model:', error);
    }
  }

  async predict(input) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const tensorInput = tf.tensor(input);
    const prediction = await this.model.predict(tensorInput);
    const result = await prediction.array();
    tensorInput.dispose();
    prediction.dispose();
    return result;
  }
}

export const tensorflowService = new TensorflowService();