import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedItem, setDetectionArea } from '../store/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { selectedItem, detectionArea } = useSelector((state) => state.settings);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    drawDetectionArea();
  }, [detectionArea]);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
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
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const updateDetectionArea = (dimension, value) => {
    dispatch(setDetectionArea({ ...detectionArea, [dimension]: value }));
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
    localStorage.setItem('detectionArea', JSON.stringify(detectionArea));
    toast({
      title: "Settings saved",
      description: "Detection area and item selection settings have been saved",
    });
  };

  const handleItemSelection = (value) => {
    dispatch(setSelectedItem(value));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Item Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleItemSelection} value={selectedItem}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an item to detect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plastic_bottle">Plastic Drinking Bottles</SelectItem>
              <SelectItem value="aluminum_can">Aluminum Cans</SelectItem>
              <SelectItem value="cardboard_carton">Cardboard Cartons</SelectItem>
            </SelectContent>
          </Select>
          {selectedItem && (
            <p className="mt-2">Selected Item: {selectedItem.replace('_', ' ')}</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detection Area Settings</CardTitle>
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