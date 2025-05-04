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
    text: "Como posso reduzir meus gastos em fastfood que aumentaram 37% no último mês?",
    category: "economia"
  },
  {
    id: 2,
    text: "Vale a pena manter minhas 3 assinaturas de streaming se uso menos de 2h por mês?",
    category: "despesas"
  },
  {
    id: 3,
    text: "Como investir meus R$ 320,00 mensais disponíveis em ETFs de dividendos?",
    category: "investimentos"
  },
  {
    id: 4,
    text: "Quais bancos digitais oferecem contas sem tarifas para substituir meu banco atual?",
    category: "finanças"
  },
  {
    id: 5,
    text: "Como economizar nos trajetos curtos que faço 12x por mês usando carros de aplicativo?",
    category: "transporte"
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
    
    if (inputLower.includes("fastfood") || inputLower.includes("37%")) {
      return "Analisei seus gastos com fastfood nos últimos 3 meses e identifiquei um padrão: você costuma pedir delivery nos dias de semana entre 18h e 20h, especialmente às terças e quintas. Sugestões específicas para reduzir esses gastos:\n\n1. Prepare marmitas nos fins de semana para esses 2 dias específicos (economia de R$ 154/mês)\n2. Utilize os cupons 'primeira compra' em novos apps (encontrei 3 disponíveis para você: iFood, Rappi e UberEats, economia de até R$ 95)\n3. Inscreva-se nos programas de fidelidade do Burger King e McDonald's, onde você gasta R$ 287,35/mês (potencial economia de 15-20%)";
    } else if (inputLower.includes("streaming") || inputLower.includes("assinatura")) {
      return "Analisei suas assinaturas e seu histórico de uso:\n\n• Netflix (R$ 39,90): Apenas 1h20min de uso em abril, assistindo principalmente à série 'Bridgerton'\n• Disney+ (R$ 33,90): 40min de uso em abril, nenhum título específico assistido por mais de 15min\n• Paramount+ (R$ 19,90): Sem uso detectado nos últimos 67 dias\n\nRecomendações:\n1. Cancele o Paramount+ imediatamente (economia de R$ 19,90/mês)\n2. Pause o Disney+ e reative quando lançarem conteúdo do seu interesse (você segue Marvel e Star Wars)\n3. Considere o plano compartilhado da Netflix com familiares (economia de R$ 23,90/mês)";
    } else if (inputLower.includes("etf") || inputLower.includes("divid")) {
      return "Com base na sua disponibilidade de R$ 320/mês e seu perfil moderado de risco, recomendo a seguinte alocação em ETFs de dividendos:\n\n• 40% em IVVB11 (S&P 500): Rendimento anual médio de 1,9% em dividendos + valorização histórica\n• 30% em DIVO11 (Ações de Dividendos Brasil): Yield médio de 7,4% ao ano\n• 30% em XPCM11 (Fundos Imobiliários): Distribuição mensal com yield médio de 8,2% ao ano\n\nCom esta carteira, você teria um potencial de R$ 92,00 trimestrais em rendimentos passivos já no primeiro ano, com perspectiva de crescimento do principal investido.\n\nPosso detalhar como abrir uma conta em corretoras sem taxa como Clear, Rico ou Nu Invest para iniciar estes investimentos.";
    } else if (inputLower.includes("banco") || inputLower.includes("tarifa")) {
      return "Analisando seu extrato bancário do Banco XYZ, identifiquei R$ 68,90 em tarifas mensais:\n\n• Tarifa de manutenção de conta: R$ 35,00\n• Tarifa de cartão de crédito: R$ 27,00\n• Tarifas por transferências: R$ 6,90\n\nRecomendo migrar para um dos seguintes bancos digitais que oferecem serviços similares sem estas taxas:\n\n1. Nubank: Conta e cartão de crédito sem anuidade, TEDs e Pix gratuitos\n2. Inter: Pacote completo com investimentos integrados\n3. PicPay: Facilidades de pagamento e cashback em compras\n\nPosso ajudar com um passo-a-passo para fazer a portabilidade, garantindo que seus débitos automáticos e recebimentos continuem funcionando durante a transição.";
    } else if (inputLower.includes("transporte") || inputLower.includes("aplicativo")) {
      return "Analisei seus 12 trajetos mensais com carros de aplicativo que custaram R$ 176,40 no total:\n\n• 8 trajetos são de casa para a academia (2,1km)\n• 4 trajetos são do trabalho para reuniões próximas (1,8km)\n\nAlternativas mais econômicas:\n\n1. Bicicletas/patinetes compartilhados: Disponíveis em sua região por R$ 8,00/trajeto (economia de R$ 96,40/mês)\n2. Transporte público: Linhas 302 e 415 atendem seus trajetos frequentes (economia de R$ 124,80/mês)\n3. Caminhada: Para os trajetos de 1,8km (25min a pé), representando benefício para saúde e economia de R$ 58,80/mês\n\nExiste também a opção de pacotes de desconto nos apps de transporte: O Uber Pass (R$ 24,99/mês) ofereceria 10% de desconto nestes trajetos específicos.";
    } else {
      return "Analisei seu perfil financeiro completo e identifiquei três oportunidades principais para otimização:\n\n1. Redução de gastos variáveis: Suas despesas com delivery (R$ 287,35) e assinaturas pouco utilizadas (R$ 93,70) representam 19% do seu orçamento mensal\n\n2. Oportunidade de investimento: Com a economia potencial de R$ 320/mês, você poderia construir inicialmente sua reserva de emergência (atualmente em 1,2 mês de despesas, ideal seriam 6 meses) e depois direcionar para investimentos em renda variável conforme seu perfil moderado\n\n3. Otimização bancária: A migração para bancos digitais eliminaria R$ 68,90 em tarifas mensais\n\nGostaria que eu detalhasse alguma dessas oportunidades específicas?";
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