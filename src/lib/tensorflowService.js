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
    const nmsResults = this.applyNMS(predictions, 0.5, 0.5); // IOU threshold: 0.5, score threshold: 0.5
    return this.filterAndTrackPredictions(nmsResults, selectedItem);
  }

  applyNMS(boxes, iouThreshold, scoreThreshold) {
    // Sort boxes by score in descending order
    boxes.sort((a, b) => b.score - a.score);

    const selected = [];
    const active = new Array(boxes.length).fill(true);

    for (let i = 0; i < boxes.length; i++) {
      if (!active[i]) continue;
      
      selected.push(boxes[i]);
      
      for (let j = i + 1; j < boxes.length; j++) {
        if (!active[j]) continue;
        
        const iou = this.calculateIOU(boxes[i].bbox, boxes[j].bbox);
        if (iou >= iouThreshold) {
          active[j] = false;
        }
      }
    }

    return selected.filter(box => box.score >= scoreThreshold);
  }

  calculateIOU(box1, box2) {
    const [x1, y1, width1, height1] = box1;
    const [x2, y2, width2, height2] = box2;

    const xA = Math.max(x1, x2);
    const yA = Math.max(y1, y2);
    const xB = Math.min(x1 + width1, x2 + width2);
    const yB = Math.min(y1 + height1, y2 + height2);

    const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const box1Area = width1 * height1;
    const box2Area = width2 * height2;

    return intersectionArea / (box1Area + box2Area - intersectionArea);
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

  async improveModel(screenshot, metadata) {
    // This is a placeholder for the actual model improvement logic
    // In a real-world scenario, you would send this data to a server
    // for further processing and model retraining
    console.log('Improving model with new data:', { screenshot, metadata });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you might update the model here
    // For now, we'll just log that the improvement is complete
    console.log('Model improvement process completed');
  }
}

export const tensorflowService = new TensorflowService();