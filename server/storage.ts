import { db } from "@db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { InsertUser, User } from "@shared/schema";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  createUser(userData: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  updateUser(id: number, userData: Partial<User>): Promise<User | null>;

  // Transaction methods
  createTransaction(transactionData: any): Promise<any>;
  getTransactions(userId: number, options?: any): Promise<any[]>;
  getTransactionById(id: number): Promise<any | null>;
  updateTransaction(id: number, transactionData: any): Promise<any | null>;
  deleteTransaction(id: number): Promise<boolean>;

  // Budget methods
  getBudgetCategories(userId: number): Promise<any[]>;
  updateBudgetCategory(id: number, budgetData: any): Promise<any | null>;

  // Goals methods
  createGoal(goalData: any): Promise<any>;
  getGoals(userId: number): Promise<any[]>;
  getGoalById(id: number): Promise<any | null>;
  updateGoal(id: number, goalData: any): Promise<any | null>;
  deleteGoal(id: number): Promise<boolean>;

  // Investments methods
  createInvestment(investmentData: any): Promise<any>;
  getInvestments(userId: number): Promise<any[]>;
  getInvestmentById(id: number): Promise<any | null>;
  updateInvestment(id: number, investmentData: any): Promise<any | null>;
  deleteInvestment(id: number): Promise<boolean>;

  // Session store
  sessionStore: session.SessionStore;
}

class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    });
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(userData).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
    return user || null;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db
      .update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser || null;
  }

  // Transaction methods
  async createTransaction(transactionData: any): Promise<any> {
    const [newTransaction] = await db
      .insert(schema.transactions)
      .values(transactionData)
      .returning();
    return newTransaction;
  }

  async getTransactions(userId: number, options: any = {}): Promise<any[]> {
    const { limit, offset, type, categoryId, dateRange, searchQuery } = options;
    
    let query = db.select().from(schema.transactions)
      .where(eq(schema.transactions.userId, userId));
    
    // Apply filters if provided
    if (type && type !== 'all') {
      query = query.where(eq(schema.transactions.type, type));
    }
    
    if (categoryId && categoryId !== 'all') {
      query = query.where(eq(schema.transactions.categoryId, parseInt(categoryId)));
    }
    
    // TODO: Implement date range and search query filters
    
    // Apply pagination
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    return await query.orderBy(schema.transactions.date);
  }

  async getTransactionById(id: number): Promise<any | null> {
    const transaction = await db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
    });
    return transaction || null;
  }

  async updateTransaction(id: number, transactionData: any): Promise<any | null> {
    const [updatedTransaction] = await db
      .update(schema.transactions)
      .set(transactionData)
      .where(eq(schema.transactions.id, id))
      .returning();
    return updatedTransaction || null;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.transactions)
      .where(eq(schema.transactions.id, id));
    return true;
  }

  // Budget methods
  async getBudgetCategories(userId: number): Promise<any[]> {
    return await db.query.budgetCategories.findMany({
      where: eq(schema.budgetCategories.userId, userId),
    });
  }

  async updateBudgetCategory(id: number, budgetData: any): Promise<any | null> {
    const [updatedBudget] = await db
      .update(schema.budgetCategories)
      .set(budgetData)
      .where(eq(schema.budgetCategories.id, id))
      .returning();
    return updatedBudget || null;
  }

  // Goals methods
  async createGoal(goalData: any): Promise<any> {
    const [newGoal] = await db
      .insert(schema.goals)
      .values(goalData)
      .returning();
    return newGoal;
  }

  async getGoals(userId: number): Promise<any[]> {
    return await db.query.goals.findMany({
      where: eq(schema.goals.userId, userId),
    });
  }

  async getGoalById(id: number): Promise<any | null> {
    const goal = await db.query.goals.findFirst({
      where: eq(schema.goals.id, id),
    });
    return goal || null;
  }

  async updateGoal(id: number, goalData: any): Promise<any | null> {
    const [updatedGoal] = await db
      .update(schema.goals)
      .set(goalData)
      .where(eq(schema.goals.id, id))
      .returning();
    return updatedGoal || null;
  }

  async deleteGoal(id: number): Promise<boolean> {
    await db
      .delete(schema.goals)
      .where(eq(schema.goals.id, id));
    return true;
  }

  // Investments methods
  async createInvestment(investmentData: any): Promise<any> {
    const [newInvestment] = await db
      .insert(schema.investments)
      .values(investmentData)
      .returning();
    return newInvestment;
  }

  async getInvestments(userId: number): Promise<any[]> {
    return await db.query.investments.findMany({
      where: eq(schema.investments.userId, userId),
    });
  }

  async getInvestmentById(id: number): Promise<any | null> {
    const investment = await db.query.investments.findFirst({
      where: eq(schema.investments.id, id),
    });
    return investment || null;
  }

  async updateInvestment(id: number, investmentData: any): Promise<any | null> {
    const [updatedInvestment] = await db
      .update(schema.investments)
      .set(investmentData)
      .where(eq(schema.investments.id, id))
      .returning();
    return updatedInvestment || null;
  }

  async deleteInvestment(id: number): Promise<boolean> {
    await db
      .delete(schema.investments)
      .where(eq(schema.investments.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
