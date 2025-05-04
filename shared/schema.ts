import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    email: z.string().email("Email inválido"),
    firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Transaction types enum
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);

// Categories model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  color: text("color"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  transactions: many(transactions),
  budgetCategories: many(budgetCategories),
}));

export const insertCategorySchema = createInsertSchema(categories)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    name: z.string().min(2, "Nome da categoria é obrigatório"),
    type: z.string().min(1, "Tipo da categoria é obrigatório"),
  });

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export const updateCategorySchema = insertCategorySchema.partial().extend({
  userId: z.number(),
});

// Transactions model
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  type: text("type", { enum: ['income', 'expense'] }).notNull(),
  isRecurring: boolean("is_recurring").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}));

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    description: z.string().min(2, "Descrição é obrigatória"),
    amount: z.coerce.number().positive("Valor deve ser maior que zero"),
    date: z.coerce.date(),
    type: z.enum(['income', 'expense']),
  });

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export const updateTransactionSchema = insertTransactionSchema.partial().omit({ userId: true });

// Budget categories model
export const budgetCategories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetCategoriesRelations = relations(budgetCategories, ({ one }) => ({
  user: one(users, { fields: [budgetCategories.userId], references: [users.id] }),
  category: one(categories, { fields: [budgetCategories.categoryId], references: [categories.id] }),
}));

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    amount: z.coerce.number().positive("Valor deve ser maior que zero"),
    month: z.number().min(1).max(12),
    year: z.number().min(2000).max(2100),
  });

export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;
export type BudgetCategory = typeof budgetCategories.$inferSelect;
export const updateBudgetCategorySchema = insertBudgetCategorySchema.partial().omit({ userId: true });

// Financial goals model
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  target: decimal("target", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  deadline: date("deadline").notNull(),
  category: text("category").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
}));

export const insertGoalSchema = createInsertSchema(goals)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    name: z.string().min(2, "Nome da meta é obrigatório"),
    target: z.coerce.number().positive("Valor deve ser maior que zero"),
    currentAmount: z.coerce.number().min(0, "Valor não pode ser negativo"),
    deadline: z.coerce.date(),
    category: z.string().min(1, "Categoria é obrigatória"),
  });

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export const updateGoalSchema = insertGoalSchema.partial().omit({ userId: true });

// Investments model
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  initialValue: decimal("initial_value", { precision: 10, scale: 2 }).notNull(),
  initialDate: date("initial_date").notNull(),
  institution: text("institution").notNull(),
  returnRate: decimal("return_rate", { precision: 6, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, { fields: [investments.userId], references: [users.id] }),
}));

export const insertInvestmentSchema = createInsertSchema(investments)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    name: z.string().min(2, "Nome do investimento é obrigatório"),
    type: z.string().min(1, "Tipo de investimento é obrigatório"),
    value: z.coerce.number().min(0, "Valor não pode ser negativo"),
    initialValue: z.coerce.number().min(0, "Valor inicial não pode ser negativo"),
    initialDate: z.coerce.date(),
    institution: z.string().min(1, "Instituição é obrigatória"),
    returnRate: z.coerce.number().optional(),
  });

export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export const updateInvestmentSchema = insertInvestmentSchema.partial().omit({ userId: true });
