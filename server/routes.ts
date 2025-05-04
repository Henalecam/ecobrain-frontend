import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const apiPrefix = "/api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);
  
  // Routes that need authentication
  const checkAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    next();
  };

  // Categories CRUD
  app.get(`${apiPrefix}/categories`, checkAuth, async (req, res) => {
    try {
      const categories = await db.query.categories.findMany({
        where: eq(schema.categories.userId, req.user.id),
      });
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  });

  app.post(`${apiPrefix}/categories`, checkAuth, async (req, res) => {
    try {
      const validatedData = schema.insertCategorySchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const [newCategory] = await db
        .insert(schema.categories)
        .values(validatedData)
        .returning();
      
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Erro ao criar categoria" });
    }
  });

  // Transactions CRUD
  app.get(`${apiPrefix}/transactions`, checkAuth, async (req, res) => {
    try {
      const { limit, page, type, categoryId, dateRange, search } = req.query;
      
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 10;
      const offset = (pageNumber - 1) * pageSize;
      
      const options = {
        limit: pageSize,
        offset,
        type: type as string,
        categoryId: categoryId as string,
        dateRange: dateRange as string,
        searchQuery: search as string,
      };
      
      const transactions = await storage.getTransactions(req.user.id, options);
      
      // Count total transactions for pagination
      let countQuery = db.select({ count: sql<number>`count(*)` })
        .from(schema.transactions)
        .where(eq(schema.transactions.userId, req.user.id));
      
      if (type && type !== 'all') {
        countQuery = countQuery.where(eq(schema.transactions.type, type as string));
      }
      
      if (categoryId && categoryId !== 'all') {
        countQuery = countQuery.where(eq(schema.transactions.categoryId, parseInt(categoryId as string)));
      }
      
      const [{ count }] = await countQuery;
      const totalPages = Math.ceil(count / pageSize);
      
      res.json({
        transactions,
        pagination: {
          total: count,
          totalPages,
          currentPage: pageNumber,
          pageSize,
        }
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Erro ao buscar transações" });
    }
  });
  
  app.get(`${apiPrefix}/transactions/recent`, checkAuth, async (req, res) => {
    try {
      const recentTransactions = await db.query.transactions.findMany({
        where: eq(schema.transactions.userId, req.user.id),
        orderBy: [desc(schema.transactions.date)],
        limit: 5,
      });
      
      res.json(recentTransactions);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      res.status(500).json({ message: "Erro ao buscar transações recentes" });
    }
  });

  app.post(`${apiPrefix}/transactions`, checkAuth, async (req, res) => {
    try {
      const validatedData = schema.insertTransactionSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const newTransaction = await storage.createTransaction(validatedData);
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Erro ao criar transação" });
    }
  });

  app.put(`${apiPrefix}/transactions/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transação não encontrada" });
      }
      
      if (transaction.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const validatedData = schema.updateTransactionSchema.parse(req.body);
      const updatedTransaction = await storage.updateTransaction(id, validatedData);
      
      res.json(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Erro ao atualizar transação" });
    }
  });

  app.delete(`${apiPrefix}/transactions/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transação não encontrada" });
      }
      
      if (transaction.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      await storage.deleteTransaction(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Erro ao excluir transação" });
    }
  });

  // Dashboard data
  app.get(`${apiPrefix}/dashboard/overview`, checkAuth, async (req, res) => {
    try {
      // Get current month's date range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      // Get transactions for the current month
      const monthTransactions = await db.query.transactions.findMany({
        where: and(
          eq(schema.transactions.userId, req.user.id),
          sql`${schema.transactions.date} >= ${firstDay.toISOString()}`,
          sql`${schema.transactions.date} <= ${lastDay.toISOString()}`
        ),
      });
      
      // Calculate monthly income and expenses
      let monthlyIncome = 0;
      let monthlyExpenses = 0;
      
      monthTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
          monthlyIncome += parseFloat(transaction.amount.toString());
        } else {
          monthlyExpenses += parseFloat(transaction.amount.toString());
        }
      });
      
      // Get latest income transaction date
      const latestIncome = await db.query.transactions.findFirst({
        where: and(
          eq(schema.transactions.userId, req.user.id),
          eq(schema.transactions.type, 'income')
        ),
        orderBy: [desc(schema.transactions.date)],
      });
      
      // Get budget to calculate percentage
      const budgetCategories = await db.query.budgetCategories.findMany({
        where: eq(schema.budgetCategories.userId, req.user.id),
      });
      
      const totalBudget = budgetCategories.reduce((sum, category) => {
        return sum + parseFloat(category.amount.toString());
      }, 0);
      
      // Prepare response data
      const overviewData = {
        currentBalance: monthlyIncome - monthlyExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings: monthlyIncome - monthlyExpenses,
        balanceChange: 8.2, // Would calculate from previous month in a real implementation
        lastIncomeDate: latestIncome ? new Date(latestIncome.date).toLocaleDateString('pt-BR') : null,
        budgetPercentage: totalBudget ? Math.round((monthlyExpenses / totalBudget) * 100) : 0,
        savingsChange: 12.5, // Would calculate from previous month in a real implementation
      };
      
      res.json(overviewData);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      res.status(500).json({ message: "Erro ao buscar visão geral do dashboard" });
    }
  });

  app.get(`${apiPrefix}/dashboard/spending-chart`, checkAuth, async (req, res) => {
    try {
      const { timeRange = '6months' } = req.query;
      
      // In a real implementation, would fetch transaction data grouped by month
      // Here we're returning sample data
      res.json({
        chartData: [
          { month: 'Jan', income: 7000, expenses: 4000 },
          { month: 'Fev', income: 6500, expenses: 4500 },
          { month: 'Mar', income: 8000, expenses: 5000 },
          { month: 'Abr', income: 7500, expenses: 4300 },
          { month: 'Mai', income: 9000, expenses: 4800 },
          { month: 'Jun', income: 8500, expenses: 4000 },
        ]
      });
    } catch (error) {
      console.error("Error fetching spending chart data:", error);
      res.status(500).json({ message: "Erro ao buscar dados do gráfico de gastos" });
    }
  });
  
  // Budget data
  app.get(`${apiPrefix}/budget/categories`, checkAuth, async (req, res) => {
    try {
      const budgetCategories = await storage.getBudgetCategories(req.user.id);
      res.json(budgetCategories);
    } catch (error) {
      console.error("Error fetching budget categories:", error);
      res.status(500).json({ message: "Erro ao buscar categorias de orçamento" });
    }
  });
  
  app.put(`${apiPrefix}/budget/categories/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await db.query.budgetCategories.findFirst({
        where: eq(schema.budgetCategories.id, id),
      });
      
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      if (category.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const validatedData = schema.updateBudgetCategorySchema.parse(req.body);
      const updatedCategory = await storage.updateBudgetCategory(id, validatedData);
      
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating budget category:", error);
      res.status(500).json({ message: "Erro ao atualizar categoria de orçamento" });
    }
  });
  
  // Financial goals
  app.get(`${apiPrefix}/goals`, checkAuth, async (req, res) => {
    try {
      const goals = await storage.getGoals(req.user.id);
      
      // Calculate savings potential (simplified implementation)
      const savingsPotential = 957.23; // Would calculate based on user's spending patterns
      
      res.json({
        goals,
        savingsPotential
      });
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Erro ao buscar metas financeiras" });
    }
  });
  
  app.post(`${apiPrefix}/goals`, checkAuth, async (req, res) => {
    try {
      const validatedData = schema.insertGoalSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const newGoal = await storage.createGoal(validatedData);
      res.status(201).json(newGoal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Erro ao criar meta financeira" });
    }
  });
  
  app.patch(`${apiPrefix}/goals/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getGoalById(id);
      
      if (!goal) {
        return res.status(404).json({ message: "Meta não encontrada" });
      }
      
      if (goal.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const validatedData = schema.updateGoalSchema.parse(req.body);
      const updatedGoal = await storage.updateGoal(id, validatedData);
      
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Erro ao atualizar meta financeira" });
    }
  });
  
  app.delete(`${apiPrefix}/goals/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getGoalById(id);
      
      if (!goal) {
        return res.status(404).json({ message: "Meta não encontrada" });
      }
      
      if (goal.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      await storage.deleteGoal(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Erro ao excluir meta financeira" });
    }
  });
  
  // Investments
  app.get(`${apiPrefix}/investments`, checkAuth, async (req, res) => {
    try {
      const investments = await storage.getInvestments(req.user.id);
      
      // Calculate portfolio summary (simplified implementation)
      const totalValue = investments.reduce((sum, investment) => {
        return sum + parseFloat(investment.value.toString());
      }, 0);
      
      const totalInitialValue = investments.reduce((sum, investment) => {
        return sum + parseFloat(investment.initialValue.toString());
      }, 0);
      
      const totalProfit = totalValue - totalInitialValue;
      const profitPercentage = totalInitialValue > 0 
        ? (totalProfit / totalInitialValue) * 100 
        : 0;
      
      // Group by investment type
      const distribution = [];
      const typeGroups = {};
      
      investments.forEach(investment => {
        if (!typeGroups[investment.type]) {
          typeGroups[investment.type] = 0;
        }
        typeGroups[investment.type] += parseFloat(investment.value.toString());
      });
      
      for (const type in typeGroups) {
        distribution.push({
          name: type,
          value: typeGroups[type]
        });
      }
      
      // Monthly growth sample data
      const monthlyGrowth = [
        { month: 'Jan', value: 40000 },
        { month: 'Fev', value: 42000 },
        { month: 'Mar', value: 43500 },
        { month: 'Abr', value: 45000 },
        { month: 'Mai', value: 48000 },
        { month: 'Jun', value: totalValue },
      ];
      
      res.json({
        investments,
        summary: {
          totalValue,
          totalInitialValue,
          totalProfit,
          profitPercentage,
          distribution,
          monthlyGrowth
        }
      });
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ message: "Erro ao buscar investimentos" });
    }
  });
  
  app.post(`${apiPrefix}/investments`, checkAuth, async (req, res) => {
    try {
      const validatedData = schema.insertInvestmentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const newInvestment = await storage.createInvestment(validatedData);
      res.status(201).json(newInvestment);
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Erro ao criar investimento" });
    }
  });
  
  app.patch(`${apiPrefix}/investments/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const investment = await storage.getInvestmentById(id);
      
      if (!investment) {
        return res.status(404).json({ message: "Investimento não encontrado" });
      }
      
      if (investment.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const validatedData = schema.updateInvestmentSchema.parse(req.body);
      const updatedInvestment = await storage.updateInvestment(id, validatedData);
      
      res.json(updatedInvestment);
    } catch (error) {
      console.error("Error updating investment:", error);
      res.status(500).json({ message: "Erro ao atualizar investimento" });
    }
  });
  
  app.delete(`${apiPrefix}/investments/:id`, checkAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const investment = await storage.getInvestmentById(id);
      
      if (!investment) {
        return res.status(404).json({ message: "Investimento não encontrado" });
      }
      
      if (investment.userId !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      await storage.deleteInvestment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting investment:", error);
      res.status(500).json({ message: "Erro ao excluir investimento" });
    }
  });
  
  // Reports endpoints
  app.get(`${apiPrefix}/reports`, checkAuth, async (req, res) => {
    try {
      const { reportType, timeRange } = req.query;
      
      // In a real implementation, would generate dynamic reports based on parameters
      // For now, return sample data
      const charts = {
        expenseVsIncome: [
          { month: 'Jan', income: 7000, expenses: 4000 },
          { month: 'Fev', income: 6500, expenses: 4500 },
          { month: 'Mar', income: 8000, expenses: 5000 },
          { month: 'Abr', income: 7500, expenses: 4300 },
          { month: 'Mai', income: 9000, expenses: 4800 },
          { month: 'Jun', income: 8500, expenses: 4000 },
        ],
        expenseByCategory: [
          { name: 'Alimentação', value: 1200 },
          { name: 'Moradia', value: 2000 },
          { name: 'Transporte', value: 800 },
          { name: 'Entretenimento', value: 500 },
          { name: 'Saúde', value: 700 },
          { name: 'Outros', value: 300 },
        ],
        monthlyTrend: [
          { month: 'Jan', expenses: 4000 },
          { month: 'Fev', expenses: 4500 },
          { month: 'Mar', expenses: 5000 },
          { month: 'Abr', expenses: 4300 },
          { month: 'Mai', expenses: 4800 },
          { month: 'Jun', expenses: 4000 },
          { month: 'Jul', expenses: 4200 },
          { month: 'Ago', expenses: 3800 },
          { month: 'Set', expenses: 4100 },
          { month: 'Out', expenses: 3900 },
          { month: 'Nov', expenses: 4300 },
          { month: 'Dez', expenses: 4800 },
        ],
      };
      
      res.json({ charts });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Erro ao gerar relatório" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
