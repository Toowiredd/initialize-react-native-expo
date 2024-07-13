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
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const { selectedItem, detectionArea } = useSelector((state) => state.settings);
  const [stream, setStream] = useState(null);

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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      videoRef.current.srcObject = newStream;
      await videoRef.current.play();
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
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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

    // Capture image if object is detected
    if (predictions.length > 0) {
      captureImage();
    }

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
    ctx.fillText(selectedItem.replace('_', ' '), x, y > 10 ? y - 5 : 10);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImages(prev => [...prev, { dataUrl: imageDataUrl, label: selectedItem }]);
    }
  };

  const updateModel = async () => {
    if (capturedImages.length === 0) {
      toast({
        title: "No images captured",
        description: "Please capture some images before updating the model",
        variant: "destructive",
      });
      return;
    }

    try {
      await tensorflowService.updateModel(capturedImages);
      toast({
        title: "Model updated successfully",
        description: `Updated with ${capturedImages.length} new images`,
      });
      setCapturedImages([]); // Clear captured images after update
    } catch (error) {
      console.error('Error updating the model:', error);
      toast({
        title: "Error updating model",
        description: "An error occurred while updating the model",
        variant: "destructive",
      });
    }
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
                width="640"
                height="480"
                className="border border-gray-300"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="absolute top-0 left-0 pointer-events-none"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={startDetection} disabled={isDetecting}>
                Start Detection
              </Button>
              <Button onClick={stopDetection} disabled={!isDetecting} variant="destructive">
                Stop Detection
              </Button>
              <Button onClick={updateModel} disabled={isDetecting || capturedImages.length === 0}>
                Update Model ({capturedImages.length} images)
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{selectedItem ? selectedItem.replace('_', ' ') : 'No item selected'}</CardTitle>
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