import { AppLayout } from "@/components/layout/app-layout";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetStatus } from "@/components/dashboard/budget-status";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FinancialGoals } from "@/components/dashboard/financial-goals";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const firstName = user?.firstName || user?.username?.split(' ')[0] || '';
  
  return (
    <AppLayout
      title="Dashboard Financeiro"
      subtitle={`Bem-vindo de volta, ${firstName}! Aqui está um resumo das suas finanças.`}
    >
      {/* Financial Overview Cards */}
      <FinancialOverview />
      
      {/* Middle Section: Charts and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SpendingChart />
        <BudgetStatus />
      </div>
      
      {/* Bottom Section: Transactions and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions />
        <FinancialGoals />
      </div>
    </AppLayout>
  );
}
