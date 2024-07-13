import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

class TensorflowService {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    try {
      this.model = await cocossd.load();
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading the model:', error);
      throw error;
    }
  }

  async detectObjects(imageElement) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(imageElement);
    return this.filterPredictions(predictions);
  }

  filterPredictions(predictions) {
    const allowedClasses = ['bottle', 'can', 'carton'];
    return predictions.filter(prediction => 
      allowedClasses.includes(prediction.class.toLowerCase())
    );
  }
}

export const tensorflowService = new TensorflowService();