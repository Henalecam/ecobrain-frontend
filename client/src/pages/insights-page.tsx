import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { FinancialAdvisor } from "@/components/ai/financial-advisor";
import { AISuggestions } from "@/components/ai/ai-suggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Dados mockados para demonstração
const mockCategoryData = [
  { name: "Alimentação", value: 1250.30, fill: "#4CAF50" },
  { name: "Moradia", value: 2100.00, fill: "#2196F3" },
  { name: "Transporte", value: 850.45, fill: "#FF9800" },
  { name: "Entretenimento", value: 720.90, fill: "#F44336" },
  { name: "Saúde", value: 350.75, fill: "#E91E63" },
  { name: "Educação", value: 520.00, fill: "#673AB7" },
  { name: "Outros", value: 480.20, fill: "#607D8B" }
];

const mockMonthlyData = [
  { name: "Jan", gastos: 4850, receitas: 7200 },
  { name: "Fev", gastos: 5100, receitas: 7200 },
  { name: "Mar", gastos: 4750, receitas: 7500 },
  { name: "Abr", gastos: 5400, receitas: 7300 },
  { name: "Mai", gastos: 4950, receitas: 7600 },
  { name: "Jun", gastos: 5300, receitas: 7200 }
];

// Dados mockados para o Dashboard de Insights
const mockInsights = [
  {
    id: 1,
    title: "Mês de Maior Economia",
    value: "Março/2025",
    description: "Você economizou R$ 2.750,00, representando 36,7% da sua receita.",
    trend: "up",
    percentage: 12.5
  },
  {
    id: 2,
    title: "Categoria Mais Cara",
    value: "Moradia",
    description: "Representa 32,4% dos seus gastos mensais totais.",
    trend: "neutral",
    percentage: 0
  },
  {
    id: 3,
    title: "Economia Potencial",
    value: "R$ 957,23",
    description: "Baseado na análise de gastos recorrentes que podem ser reduzidos.",
    trend: "up",
    percentage: 5.3
  },
  {
    id: 4,
    title: "Saúde Financeira",
    value: "Boa",
    description: "Sua proporção entre economia e gastos está acima da média.",
    trend: "up",
    percentage: 8.7
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

export default function InsightsPage() {
  const [activeView, setActiveView] = useState<string>("dashboard");

  return (
    <AppLayout 
      title="Insights e Análises" 
      subtitle="Análises avançadas e insights personalizados para suas finanças"
    >
      <div className="mb-6">
        <Tabs defaultValue="dashboard" value={activeView} onValueChange={setActiveView}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="advisor">Assessor Financeiro</TabsTrigger>
            <TabsTrigger value="suggestions">Sugestões de IA</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {mockInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader className="pb-2">
                    <CardDescription>{insight.title}</CardDescription>
                    <CardTitle className="text-2xl">{insight.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Despesas por Categoria</CardTitle>
                  <CardDescription>Distribuição dos seus gastos nos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mockCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Receitas vs Despesas</CardTitle>
                  <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockMonthlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, undefined]} />
                        <Legend />
                        <Bar dataKey="receitas" fill="#4CAF50" name="Receitas" />
                        <Bar dataKey="gastos" fill="#F44336" name="Gastos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advisor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialAdvisor />
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Dicas Rápidas</CardTitle>
                    <CardDescription>Baseadas no seu perfil financeiro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="rounded border p-3">
                        <h4 className="font-medium">Regra 50/30/20</h4>
                        <p className="text-sm text-muted-foreground">Destine 50% da sua renda para necessidades básicas, 30% para desejos e 20% para economias e investimentos.</p>
                      </li>
                      <li className="rounded border p-3">
                        <h4 className="font-medium">Reserva de Emergência</h4>
                        <p className="text-sm text-muted-foreground">Mantenha entre 3 a 6 meses de despesas guardados em investimentos de alta liquidez.</p>
                      </li>
                      <li className="rounded border p-3">
                        <h4 className="font-medium">Diversificação</h4>
                        <p className="text-sm text-muted-foreground">Distribua seus investimentos entre diferentes classes de ativos para reduzir riscos.</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <AISuggestions />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}