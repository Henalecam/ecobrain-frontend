import { useState } from "react";
import { Bot, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Dados mockados para sugestões personalizadas
const mockSuggestions = [
  {
    id: 1,
    text: "Como posso economizar dinheiro em alimentação?",
    category: "economia"
  },
  {
    id: 2,
    text: "Qual a melhor forma de começar a investir com pouco dinheiro?",
    category: "investimentos"
  },
  {
    id: 3,
    text: "Como organizar meu orçamento mensal?",
    category: "orçamento"
  },
  {
    id: 4,
    text: "Dicas para reduzir gastos com entretenimento",
    category: "economia"
  },
  {
    id: 5,
    text: "O que é reserva de emergência e como criar uma?",
    category: "planejamento"
  }
];

// Dados mockados para histórico de conversas
const mockConversationHistory = [
  {
    id: 1,
    title: "Estratégias de investimento",
    snippet: "Conversamos sobre fundos de investimentos e ações...",
    date: "2 dias atrás"
  },
  {
    id: 2,
    title: "Planejamento de aposentadoria",
    snippet: "Discutimos opções de previdência privada...",
    date: "1 semana atrás"
  }
];

// Tipos de mensagens
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function FinancialAdvisor() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Olá! Eu sou o assistente financeiro do EcoBrain. Como posso ajudá-lo hoje com suas finanças pessoais?",
      timestamp: new Date()
    }
  ]);

  // Função para lidar com perguntas sugeridas
  const handleSuggestedQuestion = (question: string) => {
    handleUserMessage(question);
  };

  // Função para simular o envio de mensagem pelo usuário
  const handleUserMessage = (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simular resposta do assistente
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getMockResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Função para gerar respostas mockadas baseadas no input
  const getMockResponse = (input: string): string => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes("economi") || inputLower.includes("gast")) {
      return "Para economizar dinheiro, considere criar um orçamento detalhado, reduzir gastos supérfluos como assinaturas não utilizadas, e usar aplicativos de cashback para compras essenciais. Baseado nos seus dados de gastos, você poderia economizar cerca de R$ 320,00 por mês reduzindo despesas em alimentação e entretenimento.";
    } else if (inputLower.includes("invest")) {
      return "Para começar a investir com pouco dinheiro, recomendo considerar primeiro sua reserva de emergência. Depois disso, ETFs e fundos de índice são boas opções para iniciantes, pois oferecem diversificação a baixo custo. Com os dados do seu perfil, você poderia começar investindo R$ 200,00 mensalmente e aumentar gradualmente com o tempo.";
    } else if (inputLower.includes("orçamento") || inputLower.includes("planej")) {
      return "Para organizar seu orçamento mensal, use a regra 50-30-20: 50% para necessidades básicas, 30% para desejos, e 20% para poupança e investimentos. Analisando suas transações, vejo que atualmente você está gastando 70% com necessidades, 25% com desejos e apenas 5% está indo para poupança. Considere rever seus gastos com alimentação fora e assinaturas para aumentar sua taxa de poupança.";
    } else if (inputLower.includes("dívida") || inputLower.includes("empréstimo")) {
      return "Para lidar com dívidas, primeiro priorize-as por taxa de juros. Concentre-se em pagar as de taxas mais altas primeiro, enquanto faz o pagamento mínimo nas demais. Métodos como a bola de neve (snowball) ou a avalanche de dívidas podem ser eficazes, dependendo da sua situação. Baseado no seu histórico financeiro, recomendo dedicar R$ 500 mensais para quitação de dívidas.";
    } else {
      return "Obrigado pela sua pergunta. Com base na análise dos seus dados financeiros, posso ver que você tem se saído bem em manter seus gastos sob controle. Continuar monitorando suas despesas e estabelecer metas financeiras específicas pode ajudá-lo a melhorar ainda mais sua saúde financeira. Há algo específico sobre finanças pessoais que você gostaria de saber mais?";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Bot className="h-5 w-5" />
          Assessor Financeiro EcoBrain
        </CardTitle>
        <CardDescription>
          Tire suas dúvidas sobre finanças e receba sugestões personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="mt-0 border-0 p-0">
            <div className="flex h-[400px] flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start gap-2">
                            {message.role === "assistant" && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="/logo-white.svg" />
                                <AvatarFallback>EB</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <p className="text-sm">{message.content}</p>
                              <span className="mt-1 block text-xs opacity-60">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          {message.role === "assistant" && (
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                                <span className="sr-only">Útil</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                                <span className="sr-only">Não útil</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] rounded-lg bg-muted p-3">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/logo-white.svg" />
                            <AvatarFallback>EB</AvatarFallback>
                          </Avatar>
                          <div className="flex gap-1">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-3 w-3 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                {activeTab === "chat" && (
                  <>
                    <div className="mb-4">
                      <p className="mb-2 text-xs text-muted-foreground">Sugestões:</p>
                      <div className="flex flex-wrap gap-2">
                        {mockSuggestions.map((suggestion) => (
                          <Badge
                            key={suggestion.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => handleSuggestedQuestion(suggestion.text)}
                          >
                            {suggestion.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Digite sua pergunta..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUserMessage(inputValue);
                          }
                        }}
                      />
                      <Button size="icon" onClick={() => handleUserMessage(inputValue)}>
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Enviar mensagem</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="h-[400px] mt-0 border-0 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar conversas" className="pl-8" />
                </div>

                <div className="space-y-4">
                  {mockConversationHistory.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex cursor-pointer flex-col rounded-md border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{conversation.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {conversation.date}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {conversation.snippet}
                      </p>
                    </div>
                  ))}

                  {mockConversationHistory.length === 0 && (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-md border p-8 text-center">
                      <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="mb-1 text-lg font-medium">Nenhuma conversa</h3>
                      <p className="text-sm text-muted-foreground">
                        Comece uma nova conversa com seu assistente financeiro.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4 text-xs text-muted-foreground">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Powered by EcoBrain AI</span>
          </div>
          <span>Assistente baseado nos seus dados financeiros</span>
        </div>
      </CardFooter>
    </Card>
  );
}