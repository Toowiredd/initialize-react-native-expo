import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Results = () => {
  const counters = useSelector((state) => state.counters);

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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recycling Results</CardTitle>
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