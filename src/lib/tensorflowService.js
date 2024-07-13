import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

class TensorflowService {
  constructor() {
    this.model = null;
    this.customModel = null;
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

  async detectObjectsByItem(video, selectedItem) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const predictions = await this.model.detect(video);
    const filteredPredictions = this.filterPredictions(predictions);
    return this.filterByItem(filteredPredictions, selectedItem);
  }

  filterByItem(predictions, selectedItem) {
    const itemMapping = {
      'plastic_bottle': ['bottle'],
      'aluminum_can': ['can'],
      'cardboard_carton': ['box', 'carton']
    };

    const allowedClasses = itemMapping[selectedItem] || [];

    return predictions.filter(prediction => 
      allowedClasses.includes(prediction.class.toLowerCase())
    );
  }

  async updateModel(capturedImages) {
    if (!this.customModel) {
      // Initialize a new custom model if it doesn't exist
      this.customModel = tf.sequential({
        layers: [
          tf.layers.conv2d({inputShape: [224, 224, 3], kernelSize: 5, filters: 8, activation: 'relu'}),
          tf.layers.maxPooling2d({poolSize: [2, 2]}),
          tf.layers.conv2d({kernelSize: 5, filters: 16, activation: 'relu'}),
          tf.layers.maxPooling2d({poolSize: [2, 2]}),
          tf.layers.flatten(),
          tf.layers.dense({units: 32, activation: 'relu'}),
          tf.layers.dense({units: 1, activation: 'sigmoid'})
        ]
      });
      
      this.customModel.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});
    }

    // Prepare the data for training
    const xs = [];
    const ys = [];

    for (const image of capturedImages) {
      const img = await this.loadImage(image.dataUrl);
      const tensor = tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat().div(255.0).expandDims();
      xs.push(tensor);
      ys.push(image.label === 'person' ? 1 : 0); // Assuming binary classification for 'person' vs 'not person'
    }

    const xDataset = tf.data.array(xs);
    const yDataset = tf.data.array(ys);
    const xyDataset = tf.data.zip({xs: xDataset, ys: yDataset}).batch(32);

    // Train the model
    await this.customModel.fitDataset(xyDataset, {
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });

    console.log('Custom model updated successfully');
  }

  async loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }
}

export const tensorflowService = new TensorflowService();