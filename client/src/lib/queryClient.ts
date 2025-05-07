import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  // Simula um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Retorna um mock genérico
  return { json: async () => ({ success: true, url, method, data, mock: true }) };
}

// Define types for mock data
type MockData = {
  '/api/dashboard/overview': {
    currentBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    balanceChange: number;
    lastIncomeDate: string;
    budgetPercentage: number;
    savingsChange: number;
  };
  '/api/dashboard/spending-chart': {
    chartData: Array<{
      month: string;
      income: number;
      expenses: number;
    }>;
  };
  '/api/budget/categories': Array<{
    id: number;
    name: string;
    spent: number;
    budget: number;
    icon: string;
  }>;
  '/api/goals': {
    goals: Array<{
      id: number;
      name: string;
      saved: number;
      target: number;
      deadline: string;
      category: string;
    }>;
    savingsPotential: number;
  };
  '/api/transactions': {
    transactions: Array<{
      id: number;
      description: string;
      amount: number;
      date: string;
      category: string;
      type: string;
    }>;
  };
  '/api/transactions/recent': Array<{
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: string;
  }>;
  [key: string]: unknown;
};

// Mock data for different endpoints
const mockData: MockData = {
  '/api/dashboard/overview': {
    currentBalance: 5742.89,
    monthlyIncome: 8350.00,
    monthlyExpenses: 4127.35,
    monthlySavings: 4222.65,
    balanceChange: 8.2,
    lastIncomeDate: "26/04/2023",
    budgetPercentage: 65,
    savingsChange: 12.5
  },
  '/api/dashboard/spending-chart': {
    chartData: [
      { month: 'Jan', income: 7000, expenses: 4000 },
      { month: 'Fev', income: 6500, expenses: 4500 },
      { month: 'Mar', income: 8000, expenses: 5000 },
      { month: 'Abr', income: 7500, expenses: 4300 },
      { month: 'Mai', income: 9000, expenses: 4800 },
      { month: 'Jun', income: 8500, expenses: 4000 },
    ]
  },
  '/api/budget/categories': [
    { id: 1, name: 'Alimentação', spent: 854.36, budget: 1200.00, icon: 'food' },
    { id: 2, name: 'Moradia', spent: 1350.00, budget: 1500.00, icon: 'home' },
    { id: 3, name: 'Transporte', spent: 478.52, budget: 600.00, icon: 'car' },
    { id: 4, name: 'Entretenimento', spent: 423.47, budget: 400.00, icon: 'tv' },
    { id: 5, name: 'Saúde', spent: 285.00, budget: 800.00, icon: 'health' },
  ],
  '/api/goals': {
    goals: [
      { id: 1, name: 'Viagem para Europa', saved: 15750, target: 21000, deadline: 'Dez 2023', category: 'viagem' },
      { id: 2, name: 'Entrada Apartamento', saved: 11500, target: 50000, deadline: 'Jun 2024', category: 'casa' },
      { id: 3, name: 'MBA Finanças', saved: 10800, target: 24000, deadline: 'Fev 2024', category: 'educação' },
    ],
    savingsPotential: 957.23
  },
  '/api/transactions': {
    transactions: [
      { id: 1, description: "Supermercado Central", amount: -253.78, date: "2023-04-29T14:30:00", category: "Alimentação", type: "expense" },
      { id: 2, description: "Conta de Energia", amount: -187.45, date: "2023-04-28T09:15:00", category: "Moradia", type: "expense" },
      { id: 3, description: "Salário", amount: 8350.00, date: "2023-04-26T10:00:00", category: "Receita", type: "income" },
      { id: 4, description: "Posto Ipiranga", amount: -152.37, date: "2023-04-25T16:45:00", category: "Transporte", type: "expense" },
      { id: 5, description: "Cinema Shopping", amount: -84.00, date: "2023-04-24T20:00:00", category: "Entretenimento", type: "expense" },
    ]
  },
  '/api/transactions/recent': [
    { id: 1, description: 'Supermercado Central', amount: -253.78, category: 'Alimentação', date: 'Hoje, 14:30', type: 'expense' },
    { id: 2, description: 'Conta de Energia', amount: -187.45, category: 'Moradia', date: 'Ontem, 09:15', type: 'expense' },
    { id: 3, description: 'Salário', amount: 8350.00, category: 'Receita', date: '26/04/2023', type: 'income' },
    { id: 4, description: 'Posto Ipiranga', amount: -152.37, category: 'Transporte', date: '25/04/2023', type: 'expense' },
    { id: 5, description: 'Cinema Shopping', amount: -84.00, category: 'Entretenimento', date: '24/04/2023', type: 'expense' },
  ]
};

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }) => {
    // Simula um pequeno delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Retorna dados mockados específicos para cada endpoint
    const endpoint = queryKey[0] as keyof MockData;
    if (mockData[endpoint]) {
      return mockData[endpoint] as T;
    }
    
    // Fallback para endpoints não mapeados
    if (options.on401 === "returnNull") {
      return null as T;
    }
    return { mock: true, queryKey } as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
