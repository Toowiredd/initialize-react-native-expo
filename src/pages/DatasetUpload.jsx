import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tensorflowService } from '../lib/tensorflowService';

const DatasetUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState('');
  const { toast } = useToast();

  const handleFolderUpload = useCallback((event) => {
    const folderItems = event.target.files;
    setFiles(Array.from(folderItems));
  }, []);

  const parseFiles = useCallback(async () => {
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    const imageFiles = files.filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.jpeg'));
    
    const parsedJsonData = await Promise.all(jsonFiles.map(async (file) => {
      const text = await file.text();
      return JSON.parse(text);
    }));

    const imageData = await Promise.all(imageFiles.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return {
        name: file.name,
        data: new Uint8Array(arrayBuffer)
      };
    }));

    setParsedData({ json: parsedJsonData, images: imageData });
  }, [files]);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select a folder to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await parseFiles();

      // Simulating file processing
      for (let i = 0; i < files.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(((i + 1) / files.length) * 100);
      }

      toast({
        title: "Upload complete",
        description: `${files.length} files processed successfully`,
      });

      // Start training process
      initiateTraining();
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const initiateTraining = async () => {
    if (!parsedData) {
      toast({
        title: "No data available",
        description: "Please upload dataset first",
        variant: "destructive",
      });
      return;
    }

    setTrainingStatus('Initiating training...');
    try {
      await tensorflowService.trainModel(parsedData);
      setTrainingStatus('Training completed successfully!');
      toast({
        title: "Training complete",
        description: "The model has been trained with the new dataset",
      });
    } catch (error) {
      console.error('Error training model:', error);
      setTrainingStatus('Error occurred during training');
      toast({
        title: "Training error",
        description: "An error occurred while training the model",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Upload and Training</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-upload">Select Dataset Folder</Label>
              <Input
                id="folder-upload"
                type="file"
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleFolderUpload}
                disabled={uploading}
              />
            </div>
            {files.length > 0 && (
              <div>
                <p>{files.length} file(s) selected</p>
                <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
              {uploading ? 'Processing...' : 'Process Dataset and Start Training'}
            </Button>
            {uploading && (
              <div>
                <Progress value={progress} className="w-full" />
                <p className="text-center">{Math.round(progress)}%</p>
              </div>
            )}
            {parsedData && (
              <div>
                <h3 className="font-bold mt-4">Parsed Data Summary:</h3>
                <p>JSON Files: {parsedData.json.length}</p>
                <p>Image Files: {parsedData.images.length}</p>
              </div>
            )}
            {trainingStatus && (
              <div>
                <h3 className="font-bold mt-4">Training Status:</h3>
                <p>{trainingStatus}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetUpload;