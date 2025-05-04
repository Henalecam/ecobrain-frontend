import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type TimeRange = "6months" | "year" | "12months";

export function SpendingChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/spending-chart', timeRange],
  });

  // Sample data structure, but we'll use API data when available
  const chartData = data?.chartData || [
    { month: 'Jan', income: 7000, expenses: 4000 },
    { month: 'Fev', income: 6500, expenses: 4500 },
    { month: 'Mar', income: 8000, expenses: 5000 },
    { month: 'Abr', income: 7500, expenses: 4300 },
    { month: 'Mai', income: 9000, expenses: 4800 },
    { month: 'Jun', income: 8500, expenses: 4000 },
  ];

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Gastos vs. Receitas</CardTitle>
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Gastos vs. Receitas</CardTitle>
        <Select 
          value={timeRange} 
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
            <SelectItem value="12months">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis 
                fontSize={12} 
                tickFormatter={(value) => `R$ ${value/1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, undefined]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Receitas"
                fill="hsl(var(--secondary))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="expenses" 
                name="Despesas"
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
