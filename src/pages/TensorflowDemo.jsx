import { useState, useEffect } from 'react';
import { tensorflowService } from '../lib/tensorflowService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TensorflowDemo = () => {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      // Replace with the actual URL of your TensorFlow.js model
      await tensorflowService.loadModel('https://example.com/model.json');
    };
    loadModel();
  }, []);

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const inputArray = input.split(',').map(Number);
      const result = await tensorflowService.predict([inputArray]);
      setPrediction(result[0][0]);
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>TensorFlow.js Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                Enter input (comma-separated numbers):
              </label>
              <Input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 1,2,3,4"
                className="mt-1"
              />
            </div>
            <Button onClick={handlePredict} disabled={isLoading}>
              {isLoading ? 'Predicting...' : 'Predict'}
            </Button>
            {prediction !== null && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Prediction Result:</h3>
                <p>{prediction}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorflowDemo;