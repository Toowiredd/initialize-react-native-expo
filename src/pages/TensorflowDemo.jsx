import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tensorflowService } from '../lib/tensorflowService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { incrementCount } from '../store/countersSlice';
import { saveDetectionArea } from '../store/settingsSlice';

const TensorflowDemo = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedItemsCount, setDetectedItemsCount] = useState(0);
  const [facingMode, setFacingMode] = useState('environment');
  const [detectionArea, setDetectionArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.settings.selectedItem);
  const counters = useSelector((state) => state.counters);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tensorflowService.loadModel();
        setIsModelLoaded(true);
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
  }, []);

  const startDetection = async () => {
    if (!isModelLoaded) {
      toast({
        title: "Model not loaded",
        description: "Please wait for the model to load",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      videoRef.current.srcObject = stream;
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
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const toggleCamera = () => {
    stopDetection();
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const detectFrame = async () => {
    if (!isDetecting || !videoRef.current || !canvasRef.current) return;

    const detectedItems = await tensorflowService.detectObjects(videoRef.current, selectedItem);
    const ctx = canvasRef.current.getContext('2d');
    
    // Clear the previous frame
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw the current video frame
    ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw detection area
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      detectionArea.x * ctx.canvas.width / 100,
      detectionArea.y * ctx.canvas.height / 100,
      detectionArea.width * ctx.canvas.width / 100,
      detectionArea.height * ctx.canvas.height / 100
    );

    // Draw bounding boxes for detected items
    let itemsInArea = 0;
    detectedItems.forEach(item => {
      const [x, y, width, height] = item.bbox;
      
      // Check if the detected item is within the detection area
      if (
        x >= detectionArea.x * ctx.canvas.width / 100 &&
        y >= detectionArea.y * ctx.canvas.height / 100 &&
        x + width <= (detectionArea.x + detectionArea.width) * ctx.canvas.width / 100 &&
        y + height <= (detectionArea.y + detectionArea.height) * ctx.canvas.height / 100
      ) {
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#00FFFF';
        ctx.font = '18px Arial';
        ctx.fillText(item.class, x, y > 10 ? y - 5 : 10);

        itemsInArea++;
      }
    });

    // Only increment the count if items are detected within the area
    if (itemsInArea > 0) {
      dispatch(incrementCount({ item: selectedItem, amount: itemsInArea }));
    }

    setDetectedItemsCount(itemsInArea);

    // Request the next animation frame
    requestAnimationFrame(detectFrame);
  };

  const handleSaveDetectionArea = () => {
    dispatch(saveDetectionArea(detectionArea));
    toast({
      title: "Detection area saved",
      description: "The detection area settings have been saved",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>TensorFlow.js Object Detection Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                style={{ width: '100%', maxWidth: '640px', height: 'auto' }}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={startDetection} disabled={isDetecting || !isModelLoaded}>
                Start Detection
              </Button>
              <Button onClick={stopDetection} disabled={!isDetecting} variant="destructive">
                Stop Detection
              </Button>
              <Button onClick={toggleCamera} disabled={isDetecting}>
                Toggle Camera
              </Button>
              <Button onClick={handleSaveDetectionArea}>
                Save Detection Area
              </Button>
            </div>
            <div className="text-center">
              <p>Selected Item: {selectedItem || 'None'}</p>
              <p>Detected Items Count: {detectedItemsCount}</p>
              <p>Current Count: {selectedItem ? counters[selectedItem].allTime : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorflowDemo;