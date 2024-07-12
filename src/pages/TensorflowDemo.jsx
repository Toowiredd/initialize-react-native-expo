import { useState, useEffect, useRef } from 'react';
import { tensorflowService } from '../lib/tensorflowService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const TensorflowDemo = () => {
  const [counts, setCounts] = useState({
    person: 0,
    car: 0,
    dog: 0,
    cat: 0,
    bicycle: 0
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tensorflowService.loadModel('https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json');
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

    // Load persisted counts
    const savedCounts = localStorage.getItem('objectCounts');
    if (savedCounts) {
      setCounts(JSON.parse(savedCounts));
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Persist counts whenever they change
    localStorage.setItem('objectCounts', JSON.stringify(counts));
  }, [counts]);

  const startDetection = async () => {
    if (!tensorflowService.model) {
      toast({
        title: "Model not loaded",
        description: "Please wait for the model to load",
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

    const predictions = await tensorflowService.detectObjects(videoRef.current);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const newCounts = { ...counts };
    predictions.forEach(prediction => {
      if (counts.hasOwnProperty(prediction.class)) {
        newCounts[prediction.class]++;
        drawPrediction(prediction, ctx);
      }
    });
    setCounts(newCounts);

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
    ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
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
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(counts).map(([item, count]) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Progress value={count} max={20} className="w-full" />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorflowDemo;