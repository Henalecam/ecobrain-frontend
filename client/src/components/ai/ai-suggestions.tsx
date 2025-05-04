import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, TrendingUp, DollarSign, Sparkles, RefreshCcw, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Dados mockados para demonstração
const mockSuggestions = [
  {
    id: 1,
    title: "Economize em alimentação",
    description: "Você gastou R$ 223,50 a mais em alimentação este mês comparado ao anterior. Considere preparar mais refeições em casa ou utilizar cupons de desconto.",
    type: "saving",
    confidence: 0.92,
    category: "Alimentação",
    potentialSavings: 200.0,
    icon: <DollarSign className="h-5 w-5 text-green-500" />
  },
  {
    id: 2,
    title: "Alerta de gasto excessivo",
    description: "Seus gastos com entretenimento estão 35% acima do orçamento estabelecido. Considere reduzir despesas não essenciais nesta categoria.",
    type: "alert",
    confidence: 0.85,
    category: "Entretenimento",
    potentialSavings: 150.0,
    icon: <PieChart className="h-5 w-5 text-amber-500" />
  },
  {
    id: 3,
    title: "Oportunidade de investimento",
    description: "Com base no seu padrão de economia, você poderia investir R$ 250,00 por mês em uma carteira diversificada. Isso poderia gerar aproximadamente R$ 33.000 em 10 anos.",
    type: "investment",
    confidence: 0.78,
    category: "Investimentos",
    potentialReturn: 33000,
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />
  },
  {
    id: 4,
    title: "Sugestão de orçamento",
    description: "Recomendamos alocar 50% da sua renda para necessidades, 30% para desejos e 20% para economias e investimentos. No momento, você está alocando apenas 5% para economias.",
    type: "budget",
    confidence: 0.88,
    category: "Orçamento",
    icon: <Sparkles className="h-5 w-5 text-violet-500" />
  }
];

// Função para obter a cor do badge com base no tipo
function getBadgeVariant(type: string) {
  switch (type) {
    case "saving":
      return "success";
    case "alert":
      return "destructive";
    case "investment":
      return "default";
    case "budget":
      return "outline";
    default:
      return "secondary";
  }
}

// Função para obter o texto do badge com base no tipo
function getBadgeText(type: string) {
  switch (type) {
    case "saving":
      return "Economia";
    case "alert":
      return "Alerta";
    case "investment":
      return "Investimento";
    case "budget":
      return "Orçamento";
    default:
      return "Sugestão";
  }
}

export function AISuggestions() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock da chamada de API para sugestões
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['/api/ai/suggestions'],
    enabled: isEnabled,
    // Para simular uma API real, usamos um setTimeout
    queryFn: async () => {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockSuggestions;
    }
  });

  // Função para simular o refresh das sugestões
  const refreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Sugestões de IA
          </CardTitle>
          <CardDescription>
            Ative para receber sugestões personalizadas de economia e orçamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch id="ai-suggestions" checked={isEnabled} onCheckedChange={setIsEnabled} />
            <Label htmlFor="ai-suggestions">Ativar sugestões de IA</Label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Sugestões de IA
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={refreshSuggestions} 
                    disabled={isRefreshing || isLoading}
                  >
                    <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Atualizar sugestões</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Atualizar sugestões</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center space-x-2">
              <Switch id="ai-suggestions" checked={isEnabled} onCheckedChange={setIsEnabled} />
              <Label htmlFor="ai-suggestions">Ativo</Label>
            </div>
          </div>
        </div>
        <CardDescription>
          Sugestões personalizadas com base nos seus dados financeiros
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </>
        ) : suggestions?.length ? (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-accent">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {suggestion.icon}
                  <h4 className="font-medium">{suggestion.title}</h4>
                </div>
                <Badge variant={getBadgeVariant(suggestion.type) as any}>
                  {getBadgeText(suggestion.type)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Categoria: {suggestion.category}</span>
                <span>Confiança: {Math.round(suggestion.confidence * 100)}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma sugestão disponível no momento.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <p>Powered by EcoBrain AI</p>
        <p>Última atualização: {new Date().toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}