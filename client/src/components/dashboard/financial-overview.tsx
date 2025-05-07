import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for financial overview
const mockData = {
  totalBalance: 12580.45,
  monthlyIncome: 8350.00,
  monthlyExpenses: 4230.75,
  savings: 4120.25,
  investments: 25000.00,
  debts: 15000.00,
  trends: {
    balance: 5.2,
    income: 3.8,
    expenses: -2.1,
    savings: 8.5
  }
};

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Format percentage for display
const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  description?: string;
}

function MetricCard({ title, value, trend, icon, description }: MetricCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : isNegative ? (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            ) : null}
            <span className={cn(
              "text-sm",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}>
              {formatPercentage(Math.abs(trend))}
            </span>
            <span className="text-sm text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function FinancialOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/financial/overview'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Saldo Total"
        value={formatCurrency(data?.totalBalance || 0)}
        trend={data?.trends.balance}
        icon={<Wallet className="h-4 w-4 text-primary" />}
        description="Inclui todas as contas"
      />
      <MetricCard
        title="Receitas Mensais"
        value={formatCurrency(data?.monthlyIncome || 0)}
        trend={data?.trends.income}
        icon={<TrendingUp className="h-4 w-4 text-green-600" />}
        description="Últimos 30 dias"
      />
      <MetricCard
        title="Despesas Mensais"
        value={formatCurrency(data?.monthlyExpenses || 0)}
        trend={data?.trends.expenses}
        icon={<TrendingDown className="h-4 w-4 text-red-600" />}
        description="Últimos 30 dias"
      />
      <MetricCard
        title="Economias"
        value={formatCurrency(data?.savings || 0)}
        trend={data?.trends.savings}
        icon={<PiggyBank className="h-4 w-4 text-blue-600" />}
        description="Total acumulado"
      />
    </div>
  );
}
