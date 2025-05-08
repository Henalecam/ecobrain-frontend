import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for spending chart
const mockData = {
  daily: [
    { date: "01/03", amount: 450.00 },
    { date: "02/03", amount: 230.50 },
    { date: "03/03", amount: 580.75 },
    { date: "04/03", amount: 320.25 },
    { date: "05/03", amount: 475.00 },
    { date: "06/03", amount: 290.50 },
    { date: "07/03", amount: 410.75 }
  ],
  weekly: [
    { week: "Sem 1", amount: 3250.00 },
    { week: "Sem 2", amount: 2980.50 },
    { week: "Sem 3", amount: 3150.75 },
    { week: "Sem 4", amount: 2890.25 }
  ],
  monthly: [
    { month: "Jan", amount: 12850.00 },
    { month: "Fev", amount: 13200.50 },
    { month: "Mar", amount: 12950.75 }
  ],
  byCategory: [
    { name: "Alimentação", value: 28, color: "#ef4444", amount: 3626.00 },
    { name: "Moradia", value: 25, color: "#3b82f6", amount: 3237.50 },
    { name: "Transporte", value: 15, color: "#22c55e", amount: 1942.50 },
    { name: "Saúde", value: 12, color: "#f59e0b", amount: 1554.00 },
    { name: "Educação", value: 10, color: "#8b5cf6", amount: 1295.00 },
    { name: "Entretenimento", value: 8, color: "#ec4899", amount: 1036.00 },
    { name: "Outros", value: 2, color: "#6b7280", amount: 259.00 }
  ]
};

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        <p className="text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-primary">{formatCurrency(data.amount)}</p>
        <p className="text-sm text-muted-foreground">{data.value}% do total</p>
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data = mockData, isLoading } = useQuery({
    queryKey: ['/api/spending/chart', timeRange],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
    initialData: mockData
  });

  console.log('SpendingChart data:', data); // Debug dos dados

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gastos</CardTitle>
            <CardDescription>Análise detalhada dos seus gastos</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-neutral-900 rounded-lg flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.[timeRange]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'}
                className="text-sm"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                className="text-sm"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#fff"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
