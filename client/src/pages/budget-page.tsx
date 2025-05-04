import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Coffee,
  Home,
  Car,
  Film,
  Heart,
  Book,
  ShoppingBag,
  Landmark,
  Wifi,
  Smartphone,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Get color based on percentage
const getColorClass = (percentage: number) => {
  if (percentage > 100) return "bg-destructive";
  if (percentage > 80) return "bg-secondary";
  return "bg-primary";
};

// Get icon based on category name
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Alimentação': <Coffee className="h-4 w-4" />,
    'Moradia': <Home className="h-4 w-4" />,
    'Transporte': <Car className="h-4 w-4" />,
    'Entretenimento': <Film className="h-4 w-4" />,
    'Saúde': <Heart className="h-4 w-4" />,
    'Educação': <Book className="h-4 w-4" />,
    'Compras': <ShoppingBag className="h-4 w-4" />,
    'Contas Fixas': <Landmark className="h-4 w-4" />,
    'Internet': <Wifi className="h-4 w-4" />,
    'Telefone': <Smartphone className="h-4 w-4" />,
    'Supermercado': <ShoppingCart className="h-4 w-4" />,
    'Outros': <Users className="h-4 w-4" />,
  };
  
  return iconMap[categoryName] || <ShoppingBag className="h-4 w-4" />;
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("current");
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/budget', activeTab],
  });

  // Sample data, but we'll use API data when available
  const budget = data?.budget || {
    month: "Abril 2023",
    totalBudget: 6000,
    totalSpent: 4127.35,
    remainingBudget: 1872.65,
    percentageSpent: 68.8,
    categories: [
      { id: 1, name: 'Alimentação', budget: 1200, spent: 854.36, icon: 'food' },
      { id: 2, name: 'Moradia', budget: 1500, spent: 1350, icon: 'home' },
      { id: 3, name: 'Transporte', budget: 600, spent: 478.52, icon: 'car' },
      { id: 4, name: 'Entretenimento', budget: 400, spent: 423.47, icon: 'tv' },
      { id: 5, name: 'Saúde', budget: 800, spent: 285, icon: 'health' },
      { id: 6, name: 'Educação', budget: 500, spent: 320, icon: 'education' },
      { id: 7, name: 'Compras', budget: 300, spent: 260, icon: 'shopping' },
      { id: 8, name: 'Contas Fixas', budget: 700, spent: 650, icon: 'bills' },
    ]
  };

  // Transform data for pie chart
  const chartData = budget.categories.map(cat => ({
    name: cat.name,
    value: Number(cat.spent),
    budget: Number(cat.budget)
  }));

  // Colors for the pie chart
  const COLORS = ['#1976D2', '#2E7D32', '#D32F2F', '#FFC107', '#9C27B0', '#FF5722', '#607D8B', '#795548'];

  if (isLoading) {
    return (
      <AppLayout title="Orçamento" subtitle="Gerencie e acompanhe seu orçamento mensal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
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
    <AppLayout title="Orçamento" subtitle="Gerencie e acompanhe seu orçamento mensal">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="current">Mês Atual</TabsTrigger>
          <TabsTrigger value="previous">Mês Anterior</TabsTrigger>
          <TabsTrigger value="next">Próximo Mês</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Orçamento Total</CardTitle>
            <CardDescription>{budget.month}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(budget.totalBudget)}</div>
            <Button variant="link" className="p-0 h-auto text-primary">
              <PlusCircle className="h-3 w-3 mr-1" />
              Ajustar orçamento
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Gastos Totais</CardTitle>
            <CardDescription>Valor usado até agora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{formatCurrency(budget.totalSpent)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowUp className={`h-3 w-3 mr-1 ${budget.percentageSpent > 80 ? 'text-destructive' : 'text-muted-foreground'}`} />
              {budget.percentageSpent}% do orçamento total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Restante</CardTitle>
            <CardDescription>Valor disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(budget.remainingBudget)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowDown className="h-3 w-3 mr-1" />
              {(100 - budget.percentageSpent).toFixed(1)}% disponível
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Progresso por Categoria</CardTitle>
            <CardDescription>
              Acompanhe o quanto você já gastou em cada categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {budget.categories.map((category) => {
                const percentage = Math.round((category.spent / category.budget) * 100);
                
                return (
                  <div key={category.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full mr-2 ${
                          percentage > 100 
                            ? 'bg-destructive/10 text-destructive' 
                            : percentage > 80 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-primary/10 text-primary'
                        }`}>
                          {getCategoryIcon(category.name)}
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(category.spent)} de {formatCurrency(category.budget)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {percentage}%
                      </div>
                    </div>
                    <Progress 
                      value={percentage > 100 ? 100 : percentage} 
                      className={`h-2 [&>div]:${getColorClass(percentage)}`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
            <CardDescription>
              Visualize como seus gastos estão distribuídos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    itemStyle={{ color: "#333" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <Button className="w-full">Ajustar Orçamento por Categoria</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
