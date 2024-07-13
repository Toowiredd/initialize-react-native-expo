import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedItem } from '../store/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.settings.selectedItem);
  const { toast } = useToast();

  const handleItemSelection = (value) => {
    dispatch(setSelectedItem(value));
  };

  const saveSettings = () => {
    // In a real application, you might want to save this to local storage or a backend
    toast({
      title: "Settings saved",
      description: "Your item selection has been saved",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Item Selection</h3>
              <p className="text-sm text-gray-500">Choose the item type for detection</p>
              <Select onValueChange={handleItemSelection} value={selectedItem}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select an item to detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pet_1">PET 1 Plastic Bottles</SelectItem>
                  <SelectItem value="hdpe_2">HDPE 2 Plastic Bottles</SelectItem>
                  <SelectItem value="aluminum_can">Aluminum Cans</SelectItem>
                  <SelectItem value="cardboard_carton">Cardboard Cartons</SelectItem>
                  <SelectItem value="glass_bottle">Glass Bottles (Manual Count)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedItem && (
              <p className="text-sm">Selected Item: {selectedItem.replace('_', ' ')}</p>
            )}
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;