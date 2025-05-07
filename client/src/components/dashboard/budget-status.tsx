import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Utensils, Car, Tv, HeartPulse, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: number;
  name: string;
  spent: number;
  budget: number;
  icon: string;
}

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Get the appropriate color class based on the percentage
const getColorForPercentage = (percentage: number) => {
  if (percentage > 100) return "bg-destructive";
  if (percentage > 80) return "bg-secondary";
  return "bg-primary";
};

// Get the appropriate icon for a category
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'alimentação':
      return <Utensils className="h-4 w-4 mr-2 text-secondary" />;
    case 'moradia':
      return <Home className="h-4 w-4 mr-2 text-primary" />;
    case 'transporte':
      return <Car className="h-4 w-4 mr-2 text-secondary" />;
    case 'entretenimento':
      return <Tv className="h-4 w-4 mr-2 text-destructive" />;
    case 'saúde':
      return <HeartPulse className="h-4 w-4 mr-2 text-success" />;
    default:
      return <Utensils className="h-4 w-4 mr-2 text-secondary" />;
  }
};

export function BudgetStatus() {
  const navigate = useNavigate();
  const { data: budgetCategories, isLoading } = useQuery<BudgetCategory[]>({
    queryKey: ['/api/budget/categories'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, name: 'Alimentação', spent: 854.36, budget: 1200.00, icon: 'food' },
        { id: 2, name: 'Moradia', spent: 1350.00, budget: 1500.00, icon: 'home' },
        { id: 3, name: 'Transporte', spent: 478.52, budget: 600.00, icon: 'car' },
        { id: 4, name: 'Entretenimento', spent: 423.47, budget: 400.00, icon: 'tv' },
        { id: 5, name: 'Saúde', spent: 285.00, budget: 800.00, icon: 'health' },
      ];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Orçamento Mensal</CardTitle>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Orçamento Mensal</CardTitle>
        <button
          onClick={() => navigate('/budget')}
          className="text-sm text-primary hover:underline flex items-center"
        >
          <span>Ver todos</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetCategories?.map((category) => {
          const percentage = Math.round((category.spent / category.budget) * 100);
          
          return (
            <div key={category.id} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {getCategoryIcon(category.name)}
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-sm font-mono">
                  <span className={percentage > 100 ? "text-destructive" : "text-foreground"}>
                    {formatCurrency(category.spent)}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span>{formatCurrency(category.budget)}</span>
                </div>
              </div>
              <Progress 
                value={percentage > 100 ? 100 : percentage} 
                className={cn("h-2", getColorForPercentage(percentage))}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
