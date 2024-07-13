import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tensorflowService } from '../lib/tensorflowService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { incrementCount } from '../store/countersSlice';
import { saveDetectionArea } from '../store/settingsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toPng } from 'html-to-image';

const TensorflowDemo = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedItemsCount, setDetectedItemsCount] = useState(0);
  const [facingMode, setFacingMode] = useState('environment');
  const [detectionArea, setDetectionArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
  const [screenshotMetadata, setScreenshotMetadata] = useState({
    itemType: '',
    quantity: '',
    lighting: '',
    background: '',
    additionalNotes: ''
  });
  const [capturedScreenshot, setCapturedScreenshot] = useState(null);
  const [isDefiningArea, setIsDefiningArea] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.settings.selectedItem);
  const savedDetectionArea = useSelector((state) => state.settings.detectionArea);
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

  useEffect(() => {
    // Load saved detection area
    setDetectionArea(savedDetectionArea);
  }, [savedDetectionArea]);

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
      
      // Trigger notification for detected items
      toast({
        title: `${selectedItem.replace('_', ' ')} Detected`,
        description: `${itemsInArea} item(s) detected in the area`,
      });
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

  const captureScreenshot = async () => {
    if (!videoRef.current) return;

    try {
      const dataUrl = await toPng(videoRef.current);
      setCapturedScreenshot(dataUrl);
      setIsScreenshotDialogOpen(true);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Screenshot error",
        description: "Unable to capture screenshot",
        variant: "destructive",
      });
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setScreenshotMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveScreenshot = async () => {
    try {
      await tensorflowService.improveModel(capturedScreenshot, screenshotMetadata);
      toast({
        title: "Model improved",
        description: "The screenshot and metadata have been used to improve the model",
      });
    } catch (error) {
      console.error('Error improving model:', error);
      toast({
        title: "Model improvement error",
        description: "Unable to improve the model with the provided data",
        variant: "destructive",
      });
    }

    setIsScreenshotDialogOpen(false);
    setScreenshotMetadata({
      itemType: '',
      quantity: '',
      lighting: '',
      background: '',
      additionalNotes: ''
    });
    setCapturedScreenshot(null);
  };

  const handleDefineArea = () => {
    setIsDefiningArea(true);
    toast({
      title: "Define Detection Area",
      description: "Use the sliders to adjust the detection area",
    });
  };

  const handleAreaChange = (key, value) => {
    setDetectionArea(prev => ({ ...prev, [key]: value[0] }));
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
              <Button onClick={handleDefineArea}>
                Define Detection Area
              </Button>
              <Button onClick={handleSaveDetectionArea}>
                Save Detection Area
              </Button>
              <Button onClick={captureScreenshot} disabled={!isDetecting}>
                Capture Screenshot
              </Button>
            </div>
            {isDefiningArea && (
              <div className="space-y-4">
                <div>
                  <Label>X Position</Label>
                  <Slider
                    value={[detectionArea.x]}
                    onValueChange={(value) => handleAreaChange('x', value)}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Y Position</Label>
                  <Slider
                    value={[detectionArea.y]}
                    onValueChange={(value) => handleAreaChange('y', value)}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Width</Label>
                  <Slider
                    value={[detectionArea.width]}
                    onValueChange={(value) => handleAreaChange('width', value)}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Slider
                    value={[detectionArea.height]}
                    onValueChange={(value) => handleAreaChange('height', value)}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}
            <div className="text-center">
              <p>Selected Item: {selectedItem || 'None'}</p>
              <p>Detected Items Count: {detectedItemsCount}</p>
              <p>Current Count: {selectedItem ? counters[selectedItem].counts[Object.keys(counters[selectedItem].counts).pop()] || 0 : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isScreenshotDialogOpen} onOpenChange={setIsScreenshotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Metadata to Screenshot</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {capturedScreenshot && (
              <img src={capturedScreenshot} alt="Captured screenshot" className="max-w-full h-auto" />
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemType" className="text-right">
                Item Type
              </Label>
              <Input
                id="itemType"
                name="itemType"
                value={screenshotMetadata.itemType}
                onChange={handleMetadataChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={screenshotMetadata.quantity}
                onChange={handleMetadataChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lighting" className="text-right">
                Lighting Conditions
              </Label>
              <Input
                id="lighting"
                name="lighting"
                value={screenshotMetadata.lighting}
                onChange={handleMetadataChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="background" className="text-right">
                Background
              </Label>
              <Input
                id="background"
                name="background"
                value={screenshotMetadata.background}
                onChange={handleMetadataChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additionalNotes" className="text-right">
                Additional Notes
              </Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={screenshotMetadata.additionalNotes}
                onChange={handleMetadataChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveScreenshot}>Save and Improve Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TensorflowDemo;