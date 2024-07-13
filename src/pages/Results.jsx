import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Results = () => {
  const counters = useSelector((state) => state.counters);
  const { toast } = useToast();

  const prepareChartData = (period) => {
    return Object.entries(counters).map(([key, value]) => ({
      name: key.replace('_', ' '),
      count: value[period],
    }));
  };

  const renderBarChart = (period) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={prepareChartData(period)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const exportToCSV = () => {
    const headers = ['Item', 'Daily', 'Weekly', 'Monthly', 'All-Time'];
    const rows = Object.entries(counters).map(([item, counts]) => [
      item,
      counts.daily,
      counts.weekly,
      counts.monthly,
      counts.allTime
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'detection_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: "Detection data has been exported to CSV.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recycling Results</span>
            <Button onClick={exportToCSV}>Export to CSV</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Daily</TableHead>
                    <TableHead>Weekly</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>All-Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(counters).map(([item, counts]) => (
                    <TableRow key={item}>
                      <TableCell className="font-medium capitalize">{item.replace('_', ' ')}</TableCell>
                      <TableCell>{counts.daily}</TableCell>
                      <TableCell>{counts.weekly}</TableCell>
                      <TableCell>{counts.monthly}</TableCell>
                      <TableCell>{counts.allTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="chart">
              <Tabs defaultValue="daily">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="allTime">All-Time</TabsTrigger>
                </TabsList>
                <TabsContent value="daily">{renderBarChart('daily')}</TabsContent>
                <TabsContent value="weekly">{renderBarChart('weekly')}</TabsContent>
                <TabsContent value="monthly">{renderBarChart('monthly')}</TabsContent>
                <TabsContent value="allTime">{renderBarChart('allTime')}</TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;