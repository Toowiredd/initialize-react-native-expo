import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

class TensorflowService {
  constructor() {
    this.model = null;
    this.detectedItems = new Map();
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

  async detectObjects(imageElement, selectedItem) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(imageElement);
    return this.filterAndTrackPredictions(predictions, selectedItem);
  }

  filterAndTrackPredictions(predictions, selectedItem) {
    const allowedClasses = {
      'pet_1': ['bottle'],
      'hdpe_2': ['bottle'],
      'aluminum_can': ['can'],
      'cardboard_carton': ['box', 'carton'],
      'glass_bottle': ['bottle']
    };

    const filteredPredictions = predictions.filter(prediction => 
      allowedClasses[selectedItem]?.includes(prediction.class.toLowerCase())
    );

    // Update detected items
    const currentTimestamp = Date.now();
    filteredPredictions.forEach(prediction => {
      const id = `${prediction.class}_${currentTimestamp}_${Math.random().toString(36).substr(2, 9)}`;
      this.detectedItems.set(id, {
        ...prediction,
        lastSeen: currentTimestamp
      });
    });

    // Remove old items
    for (const [id, item] of this.detectedItems.entries()) {
      if (currentTimestamp - item.lastSeen > 5000) { // Remove after 5 seconds
        this.detectedItems.delete(id);
      }
    }

    return Array.from(this.detectedItems.values());
  }

  getDetectedItemsCount() {
    return this.detectedItems.size;
  }
}

export const tensorflowService = new TensorflowService();