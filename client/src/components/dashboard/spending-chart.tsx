import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for spending chart
const mockData = {
  daily: [
    { date: "01/03", amount: 150.00 },
    { date: "02/03", amount: 230.50 },
    { date: "03/03", amount: 180.75 },
    { date: "04/03", amount: 320.25 },
    { date: "05/03", amount: 275.00 },
    { date: "06/03", amount: 190.50 },
    { date: "07/03", amount: 210.75 }
  ],
  weekly: [
    { week: "Sem 1", amount: 1250.00 },
    { week: "Sem 2", amount: 980.50 },
    { week: "Sem 3", amount: 1150.75 },
    { week: "Sem 4", amount: 890.25 }
  ],
  monthly: [
    { month: "Jan", amount: 4850.00 },
    { month: "Fev", amount: 5200.50 },
    { month: "Mar", amount: 4950.75 }
  ],
  byCategory: [
    { name: "Alimentação", value: 35, color: "#ef4444" },
    { name: "Moradia", value: 25, color: "#3b82f6" },
    { name: "Transporte", value: 15, color: "#22c55e" },
    { name: "Entretenimento", value: 10, color: "#f59e0b" },
    { name: "Outros", value: 15, color: "#8b5cf6" }
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

export function SpendingChart() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [view, setView] = useState<'chart' | 'categories'>('chart');

  const { data, isLoading } = useQuery({
    queryKey: ['/api/spending/chart', timeRange],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    }
  });

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
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={view} onValueChange={(value) => setView(value as 'chart' | 'categories')}>
              <TabsList>
                <TabsTrigger value="chart">Gráfico</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="chart" className="mt-0">
          <div className="h-[300px]">
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
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="categories" className="mt-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-primary">{payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data?.byCategory.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}
