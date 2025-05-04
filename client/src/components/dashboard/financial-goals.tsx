import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Plane, Home, GraduationCap, PiggyBank } from "lucide-react";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Get the appropriate icon for a goal
const getGoalIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'viagem':
      return <Plane className="text-success" />;
    case 'casa':
    case 'apartamento':
      return <Home className="text-primary" />;
    case 'educação':
      return <GraduationCap className="text-secondary" />;
    default:
      return <PiggyBank className="text-primary" />;
  }
};

export function FinancialGoals() {
  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['/api/goals'],
  });

  // Sample data structure, but we'll use API data when available
  const goals = goalsData?.goals || [
    { id: 1, name: 'Viagem para Europa', saved: 15750, target: 21000, deadline: 'Dez 2023', category: 'viagem' },
    { id: 2, name: 'Entrada Apartamento', saved: 11500, target: 50000, deadline: 'Jun 2024', category: 'casa' },
    { id: 3, name: 'MBA Finanças', saved: 10800, target: 24000, deadline: 'Fev 2024', category: 'educação' },
  ];

  const savingsPotential = goalsData?.savingsPotential || 957.23;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Metas Financeiras</CardTitle>
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex items-center mb-2">
                  <Skeleton className="h-8 w-8 rounded-lg mr-2" />
                  <div className="flex-grow">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-20 w-full mt-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Metas Financeiras</CardTitle>
        <Button variant="ghost" size="icon" className="text-primary">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {goals.map((goal) => {
            const percentage = Math.round((goal.saved / goal.target) * 100);
            const Icon = getGoalIcon(goal.category);
            
            return (
              <div key={goal.id}>
                <div className="flex items-center mb-2">
                  <div className={`bg-success/10 p-1 rounded-lg mr-2`}>
                    {Icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{goal.name}</h4>
                      <span className="font-mono text-xs font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="flex justify-between text-xs px-1">
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.saved)} de {formatCurrency(goal.target)}
                  </span>
                  <span className="text-muted-foreground">{goal.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <div>
            <p className="text-sm font-medium text-primary">Potencial de economia</p>
            <p className="text-xs text-muted-foreground">Baseado em seus gastos</p>
          </div>
          <div className="text-xl font-mono font-semibold text-primary">
            {formatCurrency(savingsPotential)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
