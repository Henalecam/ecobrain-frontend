import { Suspense, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetStatus } from "@/components/dashboard/budget-status";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FinancialGoals } from "@/components/dashboard/financial-goals";
import { AISuggestions } from "@/components/ai/ai-suggestions";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, TrendingUp, AlertCircle, Target, Wallet, ArrowUpRight, ArrowDownRight, PiggyBank, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { GoalForm } from "@/components/goals/goal-form";
import { InvestmentForm } from "@/components/investments/investment-form";
import { BudgetForm } from "@/components/budget/budget-form";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  
  const firstName = user?.firstName || user?.username?.split(' ')[0] || '';

  // Mock data for quick stats
  const quickStats = [
    { title: "Saldo Total", value: "R$ 15.750,00", change: "+12.5%", trend: "up" },
    { title: "Economias", value: "R$ 8.320,00", change: "+8.3%", trend: "up" },
    { title: "Dívidas", value: "R$ 2.450,00", change: "-15.2%", trend: "down" },
    { title: "Investimentos", value: "R$ 12.500,00", change: "+5.7%", trend: "up" }
  ];
  
  return (
    <AppLayout
      title="Dashboard Financeiro"
      subtitle={`Bem-vindo de volta, ${firstName}! Aqui está um resumo das suas finanças.`}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => setShowTransactionForm(true)}
          >
            <Plus className="h-5 w-5" />
            <span>Nova Transação</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => setShowGoalForm(true)}
          >
            <Target className="h-5 w-5" />
            <span>Definir Meta</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => setShowInvestmentForm(true)}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Investir</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => setShowBudgetForm(true)}
          >
            <Wallet className="h-5 w-5" />
            <span>Orçamento</span>
          </Button>
        </div>

        {/* Financial Overview Cards */}
        <FinancialOverview />
        
        {/* Middle Section: Charts and Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="spending" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="spending">Gastos</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="savings">Economias</TabsTrigger>
              </TabsList>
              <TabsContent value="spending" className="m-0">
                <SpendingChart />
              </TabsContent>
              <TabsContent value="income" className="m-0">
                <SpendingChart />
              </TabsContent>
              <TabsContent value="savings" className="m-0">
                <SpendingChart />
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-6">
            <BudgetStatus />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saúde Financeira</CardTitle>
                <CardDescription>Seu score financeiro atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Score Geral</span>
                    <span className="text-2xl font-bold text-primary">85/100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Economia</span>
                      </div>
                      <span className="font-medium">92%</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Dívidas</span>
                      </div>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
      </Suspense>

      {/* Modals */}
      <TransactionForm 
        open={showTransactionForm} 
        onOpenChange={setShowTransactionForm}
      />
      <GoalForm
        open={showGoalForm}
        onOpenChange={setShowGoalForm}
      />
      <InvestmentForm
        open={showInvestmentForm}
        onOpenChange={setShowInvestmentForm}
      />
      <BudgetForm
        open={showBudgetForm}
        onOpenChange={setShowBudgetForm}
      />
    </AppLayout>
  );
}
