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
          <CardTitle>Help & Tutorial</CardTitle>
          <CardDescription>Learn how to use our application effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="getting-started">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            <TabsContent value="getting-started">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Learn the basics of our application</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Set up your account in the Settings page</li>
                    <li>Choose the type of item you want to detect</li>
                    <li>Start the detection process in the Demo page</li>
                    <li>View your results in the Results page</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features Overview</CardTitle>
                  <CardDescription>Explore what our application can do</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Real-time object detection using TensorFlow.js</li>
                    <li>Customizable detection area</li>
                    <li>Multiple item type support</li>
                    <li>Detailed results and statistics</li>
                    <li>Model improvement through user feedback</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Find answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How accurate is the object detection?</AccordionTrigger>
                      <AccordionContent>
                        Our object detection is highly accurate, but results may vary depending on lighting conditions and object positioning. We continuously improve our model based on user feedback.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Can I use this application offline?</AccordionTrigger>
                      <AccordionContent>
                        Yes, our application is a Progressive Web App (PWA) that can work offline once it's been loaded. However, some features may require an internet connection.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How can I improve the model?</AccordionTrigger>
                      <AccordionContent>
                        You can contribute to model improvement by capturing screenshots and providing metadata in the Demo page. This helps us train the model with more diverse data.
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