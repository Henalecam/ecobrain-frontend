import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, TrendingUp, DollarSign, Sparkles, RefreshCcw, PieChart, MessageSquare, Send, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Dados mockados para demonstração - com sugestões mais específicas
const mockSuggestions = [
  {
    id: 1,
    title: "Aumento em gastos com fastfood",
    description: "Identificamos um aumento de 37% (R$ 287,35) em gastos com fastfood no último mês. Os estabelecimentos mais frequentes foram Burger King (7x) e McDonald's (5x). Substituir 5 refeições por opções caseiras poderia economizar aproximadamente R$ 180,00.",
    type: "alert",
    confidence: 0.94,
    category: "Alimentação",
    potentialSavings: 180.0,
    icon: <PieChart className="h-5 w-5 text-amber-500" />
  },
  {
    id: 2,
    title: "Assinaturas não utilizadas",
    description: "Você mantém 3 assinaturas de streaming que tiveram menos de 2 horas de uso no último mês: Netflix (R$ 39,90), Disney+ (R$ 33,90) e Paramount+ (R$ 19,90). Cancelar ou pausar as menos utilizadas economizaria R$ 53,80/mês.",
    type: "saving",
    confidence: 0.91,
    category: "Entretenimento",
    potentialSavings: 53.80,
    icon: <DollarSign className="h-5 w-5 text-green-500" />
  },
  {
    id: 3,
    title: "Oportunidade de investimento com dividendos",
    description: "Seu padrão de gastos mostra uma disponibilidade média de R$ 320,00/mês para investimentos. Direcionando este valor para ETFs de dividendos como IVVB11, você poderia receber aproximadamente R$ 92,00 trimestrais em rendimentos passivos já no primeiro ano.",
    type: "investment",
    confidence: 0.85,
    category: "Investimentos",
    potentialReturn: 368.00,
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />
  },
  {
    id: 4,
    title: "Aumento em tarifas bancárias",
    description: "Você pagou R$ 68,90 em tarifas bancárias no último mês, um aumento de 120% em relação à média dos 3 meses anteriores. Verificamos que bancos digitais como Nubank e Inter ofereceriam serviços similares sem estas taxas.",
    type: "alert",
    confidence: 0.97,
    category: "Finanças",
    potentialSavings: 68.90,
    icon: <Sparkles className="h-5 w-5 text-violet-500" />
  },
  {
    id: 5,
    title: "Economia em transporte",
    description: "Seus dados de localização mostram que você utilizou carros de aplicativo para 12 trajetos curtos (< 3km) no último mês, gastando R$ 176,40. Usando transporte público ou micromobilidade nestes trajetos, a economia estimada seria de R$ 124,80.",
    type: "saving",
    confidence: 0.88,
    category: "Transporte",
    potentialSavings: 124.80,
    icon: <DollarSign className="h-5 w-5 text-green-500" />
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
  const [userMessage, setUserMessage] = useState("");
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});

  // Mock da chamada de API para sugestões
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['/api/ai/suggestions'],
    enabled: isEnabled,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockSuggestions;
    }
  });

  const refreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    // TODO: Implement message sending
    setUserMessage("");
  };

  const handleFeedback = (suggestionId: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [suggestionId]: prev[suggestionId] === type ? null : type
    }));
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
    <Card className="flex flex-col h-full">
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

      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
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
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className={cn(
                    "border rounded-lg p-4 transition-all",
                    expandedSuggestion === suggestion.id 
                      ? "border-primary bg-accent" 
                      : "hover:border-primary hover:bg-accent"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {suggestion.icon}
                      <h4 className="font-medium">{suggestion.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(suggestion.type) as any}>
                        {getBadgeText(suggestion.type)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )}
                      >
                        {expandedSuggestion === suggestion.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "space-y-2 transition-all",
                    expandedSuggestion === suggestion.id ? "block" : "hidden"
                  )}>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Categoria: {suggestion.category}</span>
                      <span>Confiança: {Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 px-2",
                          feedback[suggestion.id] === 'up' && "text-green-500"
                        )}
                        onClick={() => handleFeedback(suggestion.id, 'up')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 px-2",
                          feedback[suggestion.id] === 'down' && "text-red-500"
                        )}
                        onClick={() => handleFeedback(suggestion.id, 'down')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Nenhuma sugestão disponível no momento.</p>
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            placeholder="Pergunte algo sobre suas finanças..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="min-h-[60px]"
          />
          <Button
            size="icon"
            className="self-end"
            onClick={handleSendMessage}
            disabled={!userMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <p>Powered by EcoBrain AI</p>
        <p>Última atualização: {new Date().toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}