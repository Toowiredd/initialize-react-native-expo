import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [detectionArea, setDetectionArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
      toast({
        title: "Camera access error",
        description: "Unable to access the rear camera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const updateDetectionArea = (dimension, value) => {
    setDetectionArea(prev => ({ ...prev, [dimension]: value }));
    drawDetectionArea();
  };

  const drawDetectionArea = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      detectionArea.x,
      detectionArea.y,
      detectionArea.width,
      detectionArea.height
    );
  };

  const saveSettings = () => {
    // Save detection area settings to localStorage or send to a backend
    localStorage.setItem('detectionArea', JSON.stringify(detectionArea));
    toast({
      title: "Settings saved",
      description: "Detection area settings have been saved",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Detection Area Settings</CardTitle>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position</label>
                <Slider
                  value={[detectionArea.x]}
                  onValueChange={([value]) => updateDetectionArea('x', value)}
                  max={640}
                  step={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position</label>
                <Slider
                  value={[detectionArea.y]}
                  onValueChange={([value]) => updateDetectionArea('y', value)}
                  max={480}
                  step={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <Slider
                  value={[detectionArea.width]}
                  onValueChange={([value]) => updateDetectionArea('width', value)}
                  max={640}
                  step={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <Slider
                  value={[detectionArea.height]}
                  onValueChange={([value]) => updateDetectionArea('height', value)}
                  max={480}
                  step={1}
                />
              </div>
            </div>
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;