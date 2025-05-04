import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Plane,
  Home,
  GraduationCap,
  PiggyBank,
  Car,
  Briefcase,
  Gift,
  HeartPulse,
  Plus,
  PencilLine,
  Trash,
  Target
} from "lucide-react";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Get icon for goal by category
const getGoalIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'viagem':
      return <Plane size={24} className="text-white" />;
    case 'casa':
    case 'imovel':
      return <Home size={24} className="text-white" />;
    case 'educação':
    case 'educacao':
      return <GraduationCap size={24} className="text-white" />;
    case 'carro':
    case 'veiculo':
      return <Car size={24} className="text-white" />;
    case 'carreira':
      return <Briefcase size={24} className="text-white" />;
    case 'presente':
      return <Gift size={24} className="text-white" />;
    case 'saude':
      return <HeartPulse size={24} className="text-white" />;
    default:
      return <PiggyBank size={24} className="text-white" />;
  }
};

const getBackgroundColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'viagem':
      return 'bg-success';
    case 'casa':
    case 'imovel':
      return 'bg-primary';
    case 'educação':
    case 'educacao':
      return 'bg-secondary';
    case 'carro':
    case 'veiculo':
      return 'bg-secondary-light';
    case 'carreira':
      return 'bg-primary-light';
    case 'presente':
      return 'bg-destructive';
    case 'saude':
      return 'bg-success';
    default:
      return 'bg-primary';
  }
};

// Form schema for creating/editing goals
const goalFormSchema = z.object({
  name: z.string().min(2, "O nome da meta é obrigatório"),
  target: z.coerce.number().min(1, "O valor deve ser maior que zero"),
  currentAmount: z.coerce.number().min(0, "O valor não pode ser negativo"),
  category: z.string().min(1, "Selecione uma categoria"),
  deadline: z.date({
    required_error: "Selecione uma data",
  }),
  notes: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export default function GoalsPage() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const { toast } = useToast();
  
  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['/api/goals'],
  });

  // Sample goal categories
  const goalCategories = [
    { id: 'viagem', name: 'Viagem' },
    { id: 'imovel', name: 'Imóvel' },
    { id: 'educacao', name: 'Educação' },
    { id: 'veiculo', name: 'Veículo' },
    { id: 'carreira', name: 'Carreira' },
    { id: 'presente', name: 'Presente' },
    { id: 'saude', name: 'Saúde' },
    { id: 'outros', name: 'Outros' },
  ];

  // Sample goals data
  const goals = goalsData?.goals || [
    { id: 1, name: 'Viagem para Europa', currentAmount: 15750, target: 21000, deadline: '2023-12-31', category: 'viagem', notes: 'Férias de final de ano' },
    { id: 2, name: 'Entrada Apartamento', currentAmount: 11500, target: 50000, deadline: '2024-06-30', category: 'imovel', notes: 'Apartamento de 2 quartos' },
    { id: 3, name: 'MBA Finanças', currentAmount: 10800, target: 24000, deadline: '2024-02-28', category: 'educacao', notes: 'Especialização profissional' },
    { id: 4, name: 'Novo Carro', currentAmount: 18000, target: 40000, deadline: '2024-09-30', category: 'veiculo', notes: 'Carro econômico' },
  ];

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      target: undefined,
      currentAmount: 0,
      category: "",
      deadline: undefined,
      notes: "",
    }
  });

  const createGoalMutation = useMutation({
    mutationFn: async (values: GoalFormValues) => {
      if (editingGoal) {
        // Update existing goal
        const response = await apiRequest("PATCH", `/api/goals/${editingGoal.id}`, values);
        return response.json();
      } else {
        // Create new goal
        const response = await apiRequest("POST", "/api/goals", values);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: editingGoal ? "Meta atualizada" : "Meta criada",
        description: editingGoal 
          ? "Sua meta foi atualizada com sucesso." 
          : "Sua nova meta foi criada com sucesso.",
      });
      setShowGoalForm(false);
      setEditingGoal(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível ${editingGoal ? 'atualizar' : 'criar'} a meta: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      const response = await apiRequest("DELETE", `/api/goals/${goalId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meta excluída",
        description: "Sua meta foi excluída com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível excluir a meta: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    form.reset({
      name: goal.name,
      target: goal.target,
      currentAmount: goal.currentAmount,
      category: goal.category,
      deadline: new Date(goal.deadline),
      notes: goal.notes || "",
    });
    setShowGoalForm(true);
  };

  const handleNewGoal = () => {
    setEditingGoal(null);
    form.reset({
      name: "",
      target: undefined,
      currentAmount: 0,
      category: "",
      deadline: undefined,
      notes: "",
    });
    setShowGoalForm(true);
  };

  const onSubmit = (values: GoalFormValues) => {
    createGoalMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <AppLayout title="Metas Financeiras" subtitle="Defina e acompanhe suas metas financeiras">
        <div className="flex justify-end mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Metas Financeiras" subtitle="Defina e acompanhe suas metas financeiras">
      <div className="flex justify-end mb-6">
        <Button onClick={handleNewGoal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = Math.round((goal.currentAmount / goal.target) * 100);
          const formattedDate = format(new Date(goal.deadline), "MMM yyyy", { locale: ptBR });
          const icon = getGoalIcon(goal.category);
          const bgColor = getBackgroundColor(goal.category);
          
          return (
            <Card key={goal.id} className="overflow-hidden">
              <div className="relative h-28 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <div className={`absolute -bottom-6 left-6 w-16 h-16 ${bgColor} rounded-full flex items-center justify-center shadow-md`}>
                  {icon}
                </div>
              </div>
              
              <CardHeader className="pt-10 pb-2">
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>
                  Meta para {formattedDate}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progresso</span>
                  <span className="text-sm font-semibold">{percentage}%</span>
                </div>
                
                <Progress value={percentage} className="h-2 mb-4" />
                
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-muted-foreground">de</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>
                
                {goal.notes && (
                  <p className="text-xs text-muted-foreground mt-4 line-clamp-2">{goal.notes}</p>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEditGoal(goal)}
                >
                  <PencilLine className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir esta meta?")) {
                      deleteGoalMutation.mutate(goal.id);
                    }
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {/* Add Goal Card */}
        <Card className="flex flex-col items-center justify-center h-[220px] border-dashed cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors" onClick={handleNewGoal}>
          <div className="rounded-full bg-primary/10 p-4 mb-3">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <p className="text-primary font-medium">Adicionar Nova Meta</p>
          <p className="text-sm text-muted-foreground mt-1">Defina seus próximos objetivos financeiros</p>
        </Card>
      </div>
      
      {/* Goal Form Dialog */}
      <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Editar Meta" : "Nova Meta Financeira"}</DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? "Atualize os detalhes da sua meta financeira" 
                : "Defina uma nova meta financeira para alcançar seus objetivos"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Meta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Viagem para Europa, Novo carro..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$)</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="currentAmount"
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
                      <FormDescription>
                        Quanto você já possui?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Limite</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        placeholder="Detalhes adicionais sobre esta meta..."
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
                    setShowGoalForm(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createGoalMutation.isPending}
                >
                  {createGoalMutation.isPending
                    ? "Salvando..."
                    : editingGoal
                      ? "Atualizar Meta"
                      : "Criar Meta"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
