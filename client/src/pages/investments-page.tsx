import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "@/components/layout/app-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Percent,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Format percentage
const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

// Investment form schema
const investmentFormSchema = z.object({
  name: z.string().min(2, "O nome do investimento é obrigatório"),
  type: z.string().min(1, "Selecione o tipo de investimento"),
  value: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  initialDate: z.string().min(1, "A data inicial é obrigatória"),
  institution: z.string().min(1, "A instituição é obrigatória"),
  returnRate: z.coerce.number(),
  notes: z.string().optional(),
});

type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

export default function InvestmentsPage() {
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/investments'],
  });

  // Sample investment data
  const investments = data?.investments || [
    { id: 1, name: 'Tesouro Direto', type: 'fixed_income', value: 15000, initialValue: 10000, initialDate: '2022-05-15', institution: 'Banco do Brasil', returnRate: 12.5, notes: 'Tesouro IPCA+ 2026' },
    { id: 2, name: 'Ações PETR4', type: 'stocks', value: 9500, initialValue: 10000, initialDate: '2022-03-10', institution: 'XP Investimentos', returnRate: -5, notes: 'Petrobras PN' },
    { id: 3, name: 'Fundo Imobiliário XYZ', type: 'real_estate', value: 7800, initialValue: 5000, initialDate: '2021-11-20', institution: 'BTG Pactual', returnRate: 56, notes: 'FII de shoppings' },
    { id: 4, name: 'CDB Banco XYZ', type: 'fixed_income', value: 12000, initialValue: 10000, initialDate: '2022-01-05', institution: 'Nubank', returnRate: 20, notes: '120% do CDI' },
    { id: 5, name: 'ETF IVVB11', type: 'etf', value: 8200, initialValue: 7000, initialDate: '2022-06-22', institution: 'Clear', returnRate: 17.14, notes: 'S&P 500' },
  ];

  // Portfolio summary
  const portfolioSummary = data?.summary || {
    totalValue: 52500,
    totalProfit: 10500,
    profitPercentage: 25,
    distribution: [
      { name: 'Renda Fixa', value: 27000 },
      { name: 'Ações', value: 9500 },
      { name: 'Fundos Imobiliários', value: 7800 },
      { name: 'ETFs', value: 8200 },
    ],
    monthlyGrowth: [
      { month: 'Jan', value: 40000 },
      { month: 'Fev', value: 42000 },
      { month: 'Mar', value: 43500 },
      { month: 'Abr', value: 45000 },
      { month: 'Mai', value: 48000 },
      { month: 'Jun', value: 52500 },
    ]
  };

  // Investment types
  const investmentTypes = [
    { id: 'fixed_income', name: 'Renda Fixa' },
    { id: 'stocks', name: 'Ações' },
    { id: 'real_estate', name: 'Fundos Imobiliários' },
    { id: 'etf', name: 'ETFs' },
    { id: 'crypto', name: 'Criptomoedas' },
    { id: 'international', name: 'Investimentos Internacionais' },
    { id: 'others', name: 'Outros' },
  ];

  // Financial institutions
  const financialInstitutions = [
    { id: 'banco_brasil', name: 'Banco do Brasil' },
    { id: 'caixa', name: 'Caixa Econômica' },
    { id: 'itau', name: 'Itaú' },
    { id: 'bradesco', name: 'Bradesco' },
    { id: 'santander', name: 'Santander' },
    { id: 'xp', name: 'XP Investimentos' },
    { id: 'nubank', name: 'Nubank' },
    { id: 'btg', name: 'BTG Pactual' },
    { id: 'clear', name: 'Clear' },
    { id: 'outros', name: 'Outros' },
  ];

  // Colors for charts
  const COLORS = ['#1976D2', '#2E7D32', '#D32F2F', '#FFC107', '#9C27B0', '#FF5722'];

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      name: "",
      type: "",
      value: undefined,
      initialDate: "",
      institution: "",
      returnRate: undefined,
      notes: "",
    }
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (values: InvestmentFormValues) => {
      const response = await apiRequest("POST", "/api/investments", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Investimento adicionado",
        description: "Seu investimento foi adicionado com sucesso.",
      });
      setShowInvestmentForm(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível adicionar o investimento: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: InvestmentFormValues) => {
    createInvestmentMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <AppLayout title="Investimentos" subtitle="Acompanhe e gerencie seus investimentos">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="list">Lista de Investimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <div className="flex justify-end mb-4">
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </TabsContent>
        </Tabs>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Investimentos" subtitle="Acompanhe e gerencie seus investimentos">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Lista de Investimentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Atualizado hoje
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                {portfolioSummary.totalProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-2 text-destructive" />
                )}
                Lucro Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${portfolioSummary.totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {formatCurrency(portfolioSummary.totalProfit)}
              </div>
              <div className="flex items-center text-sm">
                {portfolioSummary.profitPercentage >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1 text-primary" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1 text-destructive" />
                )}
                <span className={portfolioSummary.profitPercentage >= 0 ? 'text-primary' : 'text-destructive'}>
                  {formatPercent(portfolioSummary.profitPercentage)}
                </span>
                <span className="text-muted-foreground ml-1">de retorno</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Percent className="h-5 w-5 mr-2 text-primary" />
                Rentabilidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatPercent(portfolioSummary.profitPercentage)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                Calculado desde o início
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição da Carteira</CardTitle>
              <CardDescription>
                Como seus investimentos estão distribuídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioSummary.distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioSummary.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Patrimônio</CardTitle>
              <CardDescription>
                Crescimento do seu patrimônio ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={portfolioSummary.monthlyGrowth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Valor Total"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowInvestmentForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Investimento
            </Button>
          </div>
        
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Instituição</TableHead>
                    <TableHead className="hidden md:table-cell">Data Inicial</TableHead>
                    <TableHead className="text-right">Valor Atual</TableHead>
                    <TableHead className="text-right">Retorno</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => {
                    const typeLabel = investmentTypes.find(t => t.id === investment.type)?.name || investment.type;
                    const isPositiveReturn = investment.returnRate >= 0;
                    
                    return (
                      <TableRow key={investment.id}>
                        <TableCell className="font-medium">{investment.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeLabel}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{investment.institution}</TableCell>
                        <TableCell className="hidden md:table-cell">{investment.initialDate}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(investment.value)}</TableCell>
                        <TableCell className={`text-right font-mono ${isPositiveReturn ? 'text-primary' : 'text-destructive'}`}>
                          <div className="flex items-center justify-end">
                            {isPositiveReturn ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            {formatPercent(investment.returnRate)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Investment Form Dialog */}
      <Dialog open={showInvestmentForm} onOpenChange={setShowInvestmentForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Investimento</DialogTitle>
            <DialogDescription>
              Adicione um novo investimento à sua carteira
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Investimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Tesouro Direto, Ações PETR4..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Investimento</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {investmentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atual (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === "" ? "0" : e.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inicial</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="returnRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Retorno (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "0" : e.target.value;
                            field.onChange(parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituição Financeira</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a instituição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {financialInstitutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes adicionais sobre este investimento..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowInvestmentForm(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createInvestmentMutation.isPending}
                >
                  {createInvestmentMutation.isPending ? "Salvando..." : "Adicionar Investimento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
