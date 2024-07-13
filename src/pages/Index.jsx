import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementCount } from '../store/countersSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

const Index = () => {
  const dispatch = useDispatch();
  const counters = useSelector((state) => state.counters);
  const selectedItem = useSelector((state) => state.settings.selectedItem);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedItem) {
        dispatch(incrementCount({ item: selectedItem, amount: Math.floor(Math.random() * 3) }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch, selectedItem]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recycling Counters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(counters).map(([item, count]) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{item.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Progress value={(count / 100) * 100} max={100} className="w-full" />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Link to="/results">
                <Button>View Detailed Results</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;