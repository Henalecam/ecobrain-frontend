import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  ArrowUp,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export function FinancialOverview() {
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/overview'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const {
    currentBalance = 5742.89,
    monthlyIncome = 8350.00,
    monthlyExpenses = 4127.35,
    monthlySavings = 4222.65,
    balanceChange = 8.2,
    lastIncomeDate = "26/04/2023",
    budgetPercentage = 65,
    savingsChange = 12.5
  } = financialData || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Balance Card */}
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-muted-foreground text-sm">Saldo Atual</h3>
            <Wallet className="text-primary h-5 w-5" />
          </div>
          <p className="text-2xl font-mono font-medium">{formatCurrency(currentBalance)}</p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-primary bg-primary bg-opacity-10 px-2 py-1 rounded flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />{balanceChange}%
            </span>
            <span className="ml-2 text-muted-foreground">vs. mês passado</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Income Card */}
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-muted-foreground text-sm">Receitas (Mês)</h3>
            <TrendingUp className="text-secondary h-5 w-5" />
          </div>
          <p className="text-2xl font-mono font-medium text-secondary">{formatCurrency(monthlyIncome)}</p>
          <div className="mt-auto text-xs flex items-center">
            <Calendar className="text-secondary mr-1 h-3 w-3" />
            <span className="text-muted-foreground">Último: {lastIncomeDate}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Expenses Card */}
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-muted-foreground text-sm">Despesas (Mês)</h3>
            <TrendingDown className="text-destructive h-5 w-5" />
          </div>
          <p className="text-2xl font-mono font-medium text-destructive">{formatCurrency(monthlyExpenses)}</p>
          <div className="mt-auto text-xs flex items-center w-full">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-destructive h-1.5 rounded-full" 
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 whitespace-nowrap text-muted-foreground">{budgetPercentage}% do orçamento</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Savings Card */}
      <Card>
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-muted-foreground text-sm">Economia (Mês)</h3>
            <PiggyBank className="text-success h-5 w-5" />
          </div>
          <p className="text-2xl font-mono font-medium text-primary">{formatCurrency(monthlySavings)}</p>
          <div className="mt-auto text-xs flex items-center">
            <span className="text-primary bg-primary bg-opacity-10 px-2 py-1 rounded flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />{savingsChange}%
            </span>
            <span className="ml-2 text-muted-foreground">vs. meta mensal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
