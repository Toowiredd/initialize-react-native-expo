import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

class TensorflowService {
  constructor() {
    this.model = null;
  }

  async loadModel(modelUrl) {
    try {
      this.model = await cocossd.load();
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading the model:', error);
      throw error;
    }
  }

  async detectObjects(video) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(video);
    return predictions;
  }
}

export const tensorflowService = new TensorflowService();