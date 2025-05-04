import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  ShoppingBag, 
  CreditCard, 
  PiggyBank,
  Fuel,
  Film,
  Plus,
  Tag,
  Calendar,
  ChevronRight
} from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(amount);
};

// Get the appropriate icon for a transaction
const getTransactionIcon = (category: string, type: 'income' | 'expense') => {
  if (type === 'income') {
    return <PiggyBank className="h-5 w-5 text-secondary" />;
  }
  
  switch (category.toLowerCase()) {
    case 'alimentação':
      return <ShoppingBag className="h-5 w-5 text-destructive" />;
    case 'moradia':
      return <CreditCard className="h-5 w-5 text-secondary" />;
    case 'transporte':
      return <Fuel className="h-5 w-5 text-primary" />;
    case 'entretenimento':
      return <Film className="h-5 w-5 text-destructive" />;
    default:
      return <ShoppingBag className="h-5 w-5 text-destructive" />;
  }
};

export function RecentTransactions() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/recent'],
  });

  // Sample data structure, but we'll use API data when available
  const recentTransactions = transactions || [
    { id: 1, description: 'Supermercado Central', amount: -253.78, category: 'Alimentação', date: 'Hoje, 14:30', type: 'expense' },
    { id: 2, description: 'Conta de Energia', amount: -187.45, category: 'Moradia', date: 'Ontem, 09:15', type: 'expense' },
    { id: 3, description: 'Salário', amount: 8350.00, category: 'Receita', date: '26/04/2023', type: 'income' },
    { id: 4, description: 'Posto Ipiranga', amount: -152.37, category: 'Transporte', date: '25/04/2023', type: 'expense' },
    { id: 5, description: 'Cinema Shopping', amount: -84.00, category: 'Entretenimento', date: '24/04/2023', type: 'expense' },
  ];

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Transações Recentes</CardTitle>
          <Skeleton className="h-9 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center p-3 border-b border-border">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="flex-grow">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Transações Recentes</CardTitle>
        <Button onClick={() => setShowTransactionForm(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Transação
        </Button>
      </CardHeader>
      <CardContent>
        <div className="transaction-list overflow-y-auto max-h-80">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const transactionIcon = getTransactionIcon(transaction.category, transaction.type as 'income' | 'expense');
            
            return (
              <div 
                key={transaction.id} 
                className="flex items-center p-3 border-b border-border hover:bg-muted transition-colors rounded-lg cursor-pointer"
              >
                <div className={`rounded-full p-2 mr-3 ${isIncome ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {transactionIcon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{transaction.description}</h4>
                    <span className={`font-mono ${isIncome ? 'text-secondary' : 'text-destructive'}`}>
                      {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{transaction.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/transactions" className="text-primary text-sm flex items-center justify-center hover:underline">
            <span>Ver todas as transações</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>

      <TransactionForm 
        open={showTransactionForm} 
        onOpenChange={setShowTransactionForm}
      />
    </Card>
  );
}
