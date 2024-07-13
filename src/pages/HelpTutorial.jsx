import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const HelpTutorial = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log('Contact form submitted:', { contactName, contactEmail, contactMessage });
    toast.success("Your message has been sent. We'll get back to you soon!");
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Help & Documentation</CardTitle>
          <CardDescription>Comprehensive guide to using our application</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="getting-started">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Learn how to set up and start using our application</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>1. Account Setup</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Navigate to the Settings page</li>
                          <li>Choose your preferred item type for detection</li>
                          <li>Save your settings</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>2. Camera Access</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Ensure your device has a working camera</li>
                          <li>Grant camera permissions when prompted</li>
                          <li>If using a mobile device, you can switch between front and rear cameras</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>3. Your First Detection</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Go to the Demo page</li>
                          <li>Click "Start Detection"</li>
                          <li>Point your camera at the item you want to detect</li>
                          <li>The application will highlight detected items in real-time</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features Overview</CardTitle>
                  <CardDescription>Explore the capabilities of our application</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Real-time Object Detection</AccordionTrigger>
                      <AccordionContent>
                        <p>Our application uses TensorFlow.js to provide real-time object detection. It can identify various types of recyclable items, including:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                          <li>PET 1 Plastic Bottles</li>
                          <li>HDPE 2 Plastic Bottles</li>
                          <li>Aluminum Cans</li>
                          <li>Cardboard Cartons</li>
                          <li>Glass Bottles (Manual Count)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Customizable Detection Area</AccordionTrigger>
                      <AccordionContent>
                        <p>You can define a specific area within the camera view for detection. This helps in focusing on a particular region and improves accuracy. To use this feature:</p>
                        <ol className="list-decimal pl-5 space-y-2 mt-2">
                          <li>Click on "Define Detection Area" in the Demo page</li>
                          <li>Use the sliders to adjust the area's position and size</li>
                          <li>Click "Save Detection Area" to apply your changes</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Results Tracking and Visualization</AccordionTrigger>
                      <AccordionContent>
                        <p>The Results page offers comprehensive tracking and visualization of your recycling efforts:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                          <li>View detection counts for each item type</li>
                          <li>Analyze data using various chart types (Bar, Line, Pie)</li>
                          <li>Filter results by time range (All Time, Last Month, Last Week)</li>
                          <li>Export data to CSV for further analysis</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Model Improvement</AccordionTrigger>
                      <AccordionContent>
                        <p>Help improve the detection model by contributing data:</p>
                        <ol className="list-decimal pl-5 space-y-2 mt-2">
                          <li>Capture screenshots during detection</li>
                          <li>Add metadata to the captured images</li>
                          <li>Submit the data to help train and refine the model</li>
                        </ol>
                        <p className="mt-2">This collaborative effort enhances the accuracy of the detection system over time.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="troubleshooting">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                  <CardDescription>Solutions to common issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Camera Not Working</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Ensure you've granted camera permissions to the application</li>
                          <li>Try refreshing the page</li>
                          <li>If using a mobile device, try switching between front and rear cameras</li>
                          <li>Check if your camera works in other applications</li>
                          <li>Restart your browser or device</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Detection Not Accurate</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Ensure proper lighting in the detection area</li>
                          <li>Try adjusting the detection area to focus on the items</li>
                          <li>Make sure the items are clearly visible and not obscured</li>
                          <li>Consider contributing to model improvement by capturing and submitting screenshots with metadata</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Application Running Slowly</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Close other resource-intensive applications or browser tabs</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Ensure you're using an up-to-date browser version</li>
                          <li>If on mobile, check your device's available storage and close background apps</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Quick answers to common queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How accurate is the object detection?</AccordionTrigger>
                      <AccordionContent>
                        Our object detection is highly accurate, typically above 90% for well-lit, clear images. However, results may vary depending on lighting conditions, object positioning, and camera quality. We continuously improve our model based on user feedback and contributions.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Can I use this application offline?</AccordionTrigger>
                      <AccordionContent>
                        Yes, our application is a Progressive Web App (PWA) that can work offline once it's been loaded. However, some features like submitting screenshots for model improvement may require an internet connection. Make sure to load the app while online before using it in offline mode.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How can I improve the model?</AccordionTrigger>
                      <AccordionContent>
                        You can contribute to model improvement by capturing screenshots and providing metadata in the Demo page. This helps us train the model with more diverse data. To do this:
                        <ol className="list-decimal pl-5 space-y-2 mt-2">
                          <li>Click the "Capture Screenshot" button during detection</li>
                          <li>Fill in the metadata form with details about the captured image</li>
                          <li>Submit the data to help refine the model</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Is my data secure?</AccordionTrigger>
                      <AccordionContent>
                        We take data security seriously. All detection data is stored locally on your device. When you choose to contribute screenshots for model improvement, the images and metadata are anonymized before being sent to our servers. We do not collect or store any personally identifiable information.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Can I delete my data?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can clear all locally stored data by going to your browser settings and clearing the site data for our application. This will reset all counters and remove any saved settings. Note that any anonymized data you've contributed for model improvement cannot be individually deleted from our servers.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get in touch with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <Input
                        type="text"
                        id="name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        id="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit">Send Message</Button>
                  </form>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">Other Ways to Reach Us</h3>
                    <ul className="mt-2 space-y-2">
                      <li>Email: support@recycledetector.com</li>
                      <li>Phone: +1 (555) 123-4567</li>
                      <li>Hours: Monday - Friday, 9am - 5pm EST</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpTutorial;