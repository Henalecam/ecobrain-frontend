import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppLayout } from "@/components/layout/app-layout";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Plus, Filter, Download, Search, Trash2, Edit, Calendar, ArrowUpDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [page, setPage] = useState(1);
  const [transactionType, setTransactionType] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/transactions', page, transactionType, categoryFilter, dateRange, searchQuery],
  });

  // Sample data structure, but we'll use API data when available
  const transactions = data?.transactions || [
    { id: 1, description: "Supermercado Central", amount: -253.78, date: "2023-04-29T14:30:00", category: "Alimentação", type: "expense" },
    { id: 2, description: "Conta de Energia", amount: -187.45, date: "2023-04-28T09:15:00", category: "Moradia", type: "expense" },
    { id: 3, description: "Salário", amount: 8350.00, date: "2023-04-26T10:00:00", category: "Receita", type: "income" },
    { id: 4, description: "Posto Ipiranga", amount: -152.37, date: "2023-04-25T16:45:00", category: "Transporte", type: "expense" },
    { id: 5, description: "Cinema Shopping", amount: -84.00, date: "2023-04-24T20:00:00", category: "Entretenimento", type: "expense" },
    { id: 6, description: "Farmácia", amount: -76.50, date: "2023-04-22T11:30:00", category: "Saúde", type: "expense" },
    { id: 7, description: "Internet", amount: -109.90, date: "2023-04-20T08:00:00", category: "Moradia", type: "expense" },
    { id: 8, description: "Restaurante", amount: -120.00, date: "2023-04-19T19:30:00", category: "Alimentação", type: "expense" },
    { id: 9, description: "Uber", amount: -32.50, date: "2023-04-18T22:15:00", category: "Transporte", type: "expense" },
    { id: 10, description: "Freelance", amount: 1200.00, date: "2023-04-15T14:00:00", category: "Receita", type: "income" },
  ];

  const categories = data?.categories || [
    { id: 1, name: "Alimentação" },
    { id: 2, name: "Moradia" },
    { id: 3, name: "Transporte" },
    { id: 4, name: "Entretenimento" },
    { id: 5, name: "Saúde" },
    { id: 6, name: "Receita" },
  ];

  const totalPages = data?.totalPages || 3;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled through the queryKey dependency
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export transactions to CSV/Excel");
  };

  return (
    <AppLayout
      title="Transações"
      subtitle="Gerencie todas as suas receitas e despesas"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Todas as Transações</CardTitle>
              <CardDescription>Visualize e gerencie suas transações financeiras</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" onClick={() => setShowTransactionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar transações..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="p-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tipo</h4>
                      <Select
                        value={transactionType}
                        onValueChange={setTransactionType}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          <SelectItem value="income">Receitas</SelectItem>
                          <SelectItem value="expense">Despesas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-medium">Categoria</h4>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-medium">Período</h4>
                      <Select
                        value={dateRange}
                        onValueChange={setDateRange}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Todo o período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todo o período</SelectItem>
                          <SelectItem value="current_month">Mês atual</SelectItem>
                          <SelectItem value="last_month">Mês passado</SelectItem>
                          <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                          <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                          <SelectItem value="current_year">Ano atual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  setTransactionType("all");
                  setCategoryFilter("all");
                  setDateRange("all");
                  setSearchQuery("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Descrição</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Data
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" className="p-0 font-medium flex items-center justify-end ml-auto">
                          Valor
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Nenhuma transação encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => {
                        const isIncome = transaction.type === 'income';
                        const date = new Date(transaction.date);
                        
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.description}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant={isIncome ? "secondary" : "default"}>
                                {transaction.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(date, "dd MMM yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className={`text-right font-mono ${isIncome ? 'text-secondary' : 'text-destructive'}`}>
                              {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#" 
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TransactionForm 
        open={showTransactionForm} 
        onOpenChange={setShowTransactionForm}
      />
    </AppLayout>
  );
}
