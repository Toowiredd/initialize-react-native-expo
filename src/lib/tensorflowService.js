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

  async detectObjects(video) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(video);
    return this.filterPredictions(predictions);
  }

  filterPredictions(predictions) {
    const detectionArea = JSON.parse(localStorage.getItem('detectionArea')) || { x: 0, y: 0, width: 640, height: 480 };
    return predictions.filter(prediction => {
      const [x, y, width, height] = prediction.bbox;
      return (
        x >= detectionArea.x &&
        y >= detectionArea.y &&
        x + width <= detectionArea.x + detectionArea.width &&
        y + height <= detectionArea.y + detectionArea.height
      );
    });
  }

  async detectObjectsByItem(video, itemId) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(video);
    const filteredPredictions = this.filterPredictions(predictions);
    return this.filterByItem(filteredPredictions, itemId);
  }

  filterByItem(predictions, itemId) {
    return predictions.filter(prediction => prediction.class === itemId);
  }
}

export const tensorflowService = new TensorflowService();