import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Download, 
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Calendar,
} from "lucide-react";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("expense_vs_income");
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/reports', reportType, timeRange],
  });

  // Sample data for charts
  const expenseVsIncomeData = data?.charts?.expenseVsIncome || [
    { month: 'Jan', income: 7000, expenses: 4000 },
    { month: 'Fev', income: 6500, expenses: 4500 },
    { month: 'Mar', income: 8000, expenses: 5000 },
    { month: 'Abr', income: 7500, expenses: 4300 },
    { month: 'Mai', income: 9000, expenses: 4800 },
    { month: 'Jun', income: 8500, expenses: 4000 },
  ];

  const expenseByCategoryData = data?.charts?.expenseByCategory || [
    { name: 'Alimentação', value: 1200 },
    { name: 'Moradia', value: 2000 },
    { name: 'Transporte', value: 800 },
    { name: 'Entretenimento', value: 500 },
    { name: 'Saúde', value: 700 },
    { name: 'Outros', value: 300 },
  ];

  const monthlyTrendData = data?.charts?.monthlyTrend || [
    { month: 'Jan', expenses: 4000 },
    { month: 'Fev', expenses: 4500 },
    { month: 'Mar', expenses: 5000 },
    { month: 'Abr', expenses: 4300 },
    { month: 'Mai', expenses: 4800 },
    { month: 'Jun', expenses: 4000 },
    { month: 'Jul', expenses: 4200 },
    { month: 'Ago', expenses: 3800 },
    { month: 'Set', expenses: 4100 },
    { month: 'Out', expenses: 3900 },
    { month: 'Nov', expenses: 4300 },
    { month: 'Dez', expenses: 4800 },
  ];

  // Colors for charts
  const COLORS = ['#1976D2', '#2E7D32', '#D32F2F', '#FFC107', '#9C27B0', '#FF5722'];

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export report to PDF/Excel");
  };

  if (isLoading) {
    return (
      <AppLayout title="Relatórios" subtitle="Analise seus dados financeiros">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full rounded-md" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Relatórios" subtitle="Analise seus dados financeiros">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Análise Financeira</CardTitle>
              <CardDescription>
                Visualize e compare seus dados financeiros ao longo do tempo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="12months">Últimos 12 meses</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={reportType} onValueChange={setReportType}>
            <TabsList className="mb-4">
              <TabsTrigger value="expense_vs_income" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                Receitas vs. Despesas
              </TabsTrigger>
              <TabsTrigger value="expense_by_category" className="flex items-center">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Despesas por Categoria
              </TabsTrigger>
              <TabsTrigger value="monthly_trend" className="flex items-center">
                <LineChartIcon className="mr-2 h-4 w-4" />
                Tendência Mensal
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="expense_vs_income" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenseVsIncomeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
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
            </TabsContent>
            
            <TabsContent value="expense_by_category" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="monthly_trend" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, undefined]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Despesas" 
                    stroke="hsl(var(--destructive))" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo Mensal</CardTitle>
            <CardDescription>
              Compare seus gastos mês a mês
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseVsIncomeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar 
                  dataKey="expenses" 
                  name="Despesas" 
                  fill="hsl(var(--destructive))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Economia Mensal</CardTitle>
            <CardDescription>
              Veja quanto você economizou a cada mês
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={expenseVsIncomeData.map(item => ({
                  month: item.month,
                  savings: item.income - item.expenses
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  name="Economia" 
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
