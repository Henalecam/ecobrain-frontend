import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Utensils, Car, Tv, HeartPulse } from "lucide-react";
import { Link } from "wouter";

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
  const { data: budgetCategories, isLoading } = useQuery({
    queryKey: ['/api/budget/categories'],
  });

  // Sample data structure, but we'll use API data when available
  const categories = budgetCategories || [
    { id: 1, name: 'Alimentação', spent: 854.36, budget: 1200.00, icon: 'food' },
    { id: 2, name: 'Moradia', spent: 1350.00, budget: 1500.00, icon: 'home' },
    { id: 3, name: 'Transporte', spent: 478.52, budget: 600.00, icon: 'car' },
    { id: 4, name: 'Entretenimento', spent: 423.47, budget: 400.00, icon: 'tv' },
    { id: 5, name: 'Saúde', spent: 285.00, budget: 800.00, icon: 'health' },
  ];

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
        <Link href="/budget" className="text-sm text-primary hover:underline flex items-center">
          <span>Ver todos</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
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
                className="h-2" 
                indicatorClassName={getColorForPercentage(percentage)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
