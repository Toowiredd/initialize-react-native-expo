import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DatasetUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulating file upload
    for (let i = 0; i < files.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setProgress(((i + 1) / files.length) * 100);
    }

    setUploading(false);
    setFiles([]);
    setProgress(0);

    toast({
      title: "Upload complete",
      description: `${files.length} files uploaded successfully`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataset-upload">Select Dataset Files</Label>
              <Input
                id="dataset-upload"
                type="file"
                multiple
                accept=".json,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            {files.length > 0 && (
              <div>
                <p>{files.length} file(s) selected</p>
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </Button>
            {uploading && (
              <div>
                <Progress value={progress} className="w-full" />
                <p className="text-center">{Math.round(progress)}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetUpload;