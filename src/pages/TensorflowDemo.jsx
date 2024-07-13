import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { tensorflowService } from '../lib/tensorflowService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const TensorflowDemo = () => {
  const [count, setCount] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const selectedItem = useSelector((state) => state.settings.selectedItem);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tensorflowService.loadModel();
        toast({
          title: "Model loaded successfully",
          description: "Ready to start object detection",
        });
      } catch (error) {
        console.error('Error loading the model:', error);
        toast({
          title: "Error loading model",
          description: "Please check your connection and try again",
          variant: "destructive",
        });
      }
    };
    loadModel();

    // Load persisted count
    const savedCount = localStorage.getItem('objectCount');
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Persist count whenever it changes
    localStorage.setItem('objectCount', count.toString());
  }, [count]);

  const startDetection = async () => {
    if (!tensorflowService.model) {
      toast({
        title: "Model not loaded",
        description: "Please wait for the model to load",
        variant: "destructive",
      });
      return;
    }

    if (!selectedItem) {
      toast({
        title: "No item selected",
        description: "Please select an item in the settings page",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsDetecting(true);
      detectFrame();
    } catch (error) {
      console.error('Error accessing the camera:', error);
      toast({
        title: "Camera access error",
        description: "Unable to access the camera",
        variant: "destructive",
      });
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const detectFrame = async () => {
    if (!isDetecting || !videoRef.current || !canvasRef.current) return;

    const predictions = await tensorflowService.detectObjectsByItem(videoRef.current, selectedItem);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    setCount(prevCount => prevCount + predictions.length);
    predictions.forEach(prediction => {
      drawPrediction(prediction, ctx);
    });

    requestAnimationFrame(detectFrame);
  };

  const drawPrediction = (prediction, ctx) => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];

    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#00FFFF';
    ctx.fillText(selectedItem, x, y > 10 ? y - 5 : 10);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Object Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                style={{ display: 'none' }}
                width="640"
                height="480"
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="border border-gray-300"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={startDetection} disabled={isDetecting}>
                Start Detection
              </Button>
              <Button onClick={stopDetection} disabled={!isDetecting} variant="destructive">
                Stop Detection
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{selectedItem || 'No item selected'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Progress value={count} max={100} className="w-full" />
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorflowDemo;