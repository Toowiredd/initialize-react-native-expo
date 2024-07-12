import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { tensorflowService } from '../lib/tensorflowService';

const Index = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [detectionCounts, setDetectionCounts] = useState({
    person: 0,
    car: 0,
    dog: 0,
    cat: 0,
    bicycle: 0
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const { toast } = useToast();

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
  }, []);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsDetecting(true);
      detectObjects(stream);
    } catch (error) {
      console.error('Error accessing the camera:', error);
      toast({
        title: "Camera access error",
        description: "Unable to access the rear camera",
        variant: "destructive",
      });
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
  };

  const detectObjects = async (stream) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const detectFrame = async () => {
      if (!isDetecting) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      const predictions = await tensorflowService.detectObjects(video);
      const newCounts = { ...detectionCounts };
      predictions.forEach(prediction => {
        if (newCounts.hasOwnProperty(prediction.class)) {
          newCounts[prediction.class]++;
        }
      });
      setDetectionCounts(newCounts);

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Real-Time Object Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button onClick={startDetection} disabled={isDetecting}>
                Start Detection
              </Button>
              <Button onClick={stopDetection} disabled={!isDetecting} variant="destructive">
                Stop Detection
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(detectionCounts).map(([item, count]) => (
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
      <Card>
        <CardHeader>
          <CardTitle>Redux Counter Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center space-x-4">
            <Button onClick={() => dispatch(decrement())}>-</Button>
            <span className="text-2xl">{count}</span>
            <Button onClick={() => dispatch(increment())}>+</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;