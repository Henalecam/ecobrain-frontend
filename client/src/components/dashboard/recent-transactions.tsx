import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data for recent transactions
const mockTransactions = [
  {
    id: 1,
    description: "Supermercado Central",
    amount: -253.78,
    date: "2024-03-15T14:30:00",
    category: "Alimentação",
    type: "expense",
    status: "completed"
  },
  {
    id: 2,
    description: "Salário",
    amount: 8350.00,
    date: "2024-03-10T10:00:00",
    category: "Receita",
    type: "income",
    status: "completed"
  },
  {
    id: 3,
    description: "Conta de Energia",
    amount: -187.45,
    date: "2024-03-08T09:15:00",
    category: "Moradia",
    type: "expense",
    status: "pending"
  },
  {
    id: 4,
    description: "Freelance",
    amount: 1200.00,
    date: "2024-03-05T14:00:00",
    category: "Receita",
    type: "income",
    status: "completed"
  },
  {
    id: 5,
    description: "Internet",
    amount: -109.90,
    date: "2024-03-01T08:00:00",
    category: "Moradia",
    type: "expense",
    status: "completed"
  }
];

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export function RecentTransactions() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Mock API call
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/recent', filter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTransactions;
    }
  });

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Suas últimas movimentações financeiras</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('income')}>
                Receitas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('expense')}>
                Despesas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions?.length ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const isIncome = transaction.type === 'income';
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        isIncome ? "bg-green-100" : "bg-red-100"
                      )}>
                        {isIncome ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "font-medium",
                        isIncome ? "text-green-600" : "text-red-600"
                      )}>
                        {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
