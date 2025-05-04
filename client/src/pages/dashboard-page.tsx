import { AppLayout } from "@/components/layout/app-layout";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetStatus } from "@/components/dashboard/budget-status";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FinancialGoals } from "@/components/dashboard/financial-goals";
import { AISuggestions } from "@/components/ai/ai-suggestions";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="lg:col-span-2">
          <Tabs defaultValue="spending" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="spending">Gastos</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
            </TabsList>
            <TabsContent value="spending" className="m-0">
              <SpendingChart />
            </TabsContent>
            <TabsContent value="income" className="m-0">
              <SpendingChart />
            </TabsContent>
          </Tabs>
        </div>
        <BudgetStatus />
      </div>
      
      {/* Bottom Section: Transactions, Goals and AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentTransactions />
            <FinancialGoals />
          </div>
        </div>
        <div className="lg:col-span-1">
          <AISuggestions />
        </div>
      </div>
    </AppLayout>
  );
}
