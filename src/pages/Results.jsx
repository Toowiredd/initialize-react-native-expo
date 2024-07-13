import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Results = () => {
  const counters = useSelector((state) => state.counters);

  // Mock data for weekly and monthly counts
  const weeklyData = Object.fromEntries(
    Object.entries(counters).map(([key, value]) => [key, Math.floor(value * 0.2)])
  );

  const monthlyData = Object.fromEntries(
    Object.entries(counters).map(([key, value]) => [key, Math.floor(value * 0.8)])
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recycling Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Weekly</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>All-Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(counters).map(([item, count]) => (
                <TableRow key={item}>
                  <TableCell className="font-medium capitalize">{item.replace('_', ' ')}</TableCell>
                  <TableCell>{weeklyData[item]}</TableCell>
                  <TableCell>{monthlyData[item]}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;