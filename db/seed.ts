import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Seeding database...");

    // Create a default user for testing
    let user = await db.query.users.findFirst({
      where: eq(schema.users.username, "demo"),
    });

    if (!user) {
      console.log("Creating demo user...");
      const [newUser] = await db
        .insert(schema.users)
        .values({
          username: "demo",
          password: await hashPassword("password"),
          email: "demo@ecobrain.com",
          firstName: "Carlos",
          lastName: "Silva",
        })
        .returning();
      
      user = newUser;
      console.log(`User created with ID: ${user.id}`);
    } else {
      console.log(`User already exists with ID: ${user.id}`);
    }

    // Add transaction categories
    const categoryTypes = [
      { name: "Alimentação", type: "expense", color: "#4CAF50", icon: "restaurant" },
      { name: "Moradia", type: "expense", color: "#2196F3", icon: "home" },
      { name: "Transporte", type: "expense", color: "#FF9800", icon: "directions_car" },
      { name: "Entretenimento", type: "expense", color: "#F44336", icon: "movie" },
      { name: "Saúde", type: "expense", color: "#E91E63", icon: "medical_services" },
      { name: "Educação", type: "expense", color: "#673AB7", icon: "school" },
      { name: "Compras", type: "expense", color: "#3F51B5", icon: "shopping_bag" },
      { name: "Contas Fixas", type: "expense", color: "#607D8B", icon: "receipt" },
      { name: "Receita", type: "income", color: "#4CAF50", icon: "payments" },
      { name: "Investimentos", type: "expense", color: "#009688", icon: "trending_up" },
    ];

    // Check if categories exist
    const existingCategories = await db.query.categories.findMany({
      where: eq(schema.categories.userId, user.id),
    });

    if (existingCategories.length === 0) {
      console.log("Creating categories...");
      for (const category of categoryTypes) {
        await db.insert(schema.categories).values({
          userId: user.id,
          name: category.name,
          type: category.type,
          color: category.color,
          icon: category.icon,
        });
      }
      console.log("Categories created");
    } else {
      console.log("Categories already exist");
    }

    // Get categories for transaction creation
    const categories = await db.query.categories.findMany({
      where: eq(schema.categories.userId, user.id),
    });

    const categoryMap = categories.reduce((map, category) => {
      map[category.name] = category.id;
      return map;
    }, {} as Record<string, number>);

    // Check if budget categories exist
    const existingBudgetCategories = await db.query.budgetCategories.findMany({
      where: eq(schema.budgetCategories.userId, user.id),
    });

    if (existingBudgetCategories.length === 0) {
      console.log("Creating budget categories...");
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Budget amounts
      const budgetAmounts = {
        "Alimentação": 1200,
        "Moradia": 1500,
        "Transporte": 600,
        "Entretenimento": 400,
        "Saúde": 800,
        "Educação": 500,
        "Compras": 300,
        "Contas Fixas": 700,
      };

      for (const [categoryName, amount] of Object.entries(budgetAmounts)) {
        const categoryId = categoryMap[categoryName];
        if (categoryId) {
          await db.insert(schema.budgetCategories).values({
            userId: user.id,
            categoryId,
            amount,
            month: currentMonth,
            year: currentYear,
          });
        }
      }
      console.log("Budget categories created");
    } else {
      console.log("Budget categories already exist");
    }

    // Check if transactions exist
    const existingTransactions = await db.query.transactions.findMany({
      where: eq(schema.transactions.userId, user.id),
    });

    if (existingTransactions.length === 0) {
      console.log("Creating sample transactions...");
      
      // Sample transactions
      const transactions = [
        { description: "Supermercado Central", amount: 253.78, date: new Date("2023-04-29T14:30:00"), type: "expense", categoryName: "Alimentação" },
        { description: "Conta de Energia", amount: 187.45, date: new Date("2023-04-28T09:15:00"), type: "expense", categoryName: "Moradia" },
        { description: "Salário", amount: 8350.00, date: new Date("2023-04-26T10:00:00"), type: "income", categoryName: "Receita" },
        { description: "Posto Ipiranga", amount: 152.37, date: new Date("2023-04-25T16:45:00"), type: "expense", categoryName: "Transporte" },
        { description: "Cinema Shopping", amount: 84.00, date: new Date("2023-04-24T20:00:00"), type: "expense", categoryName: "Entretenimento" },
        { description: "Farmácia", amount: 76.50, date: new Date("2023-04-22T11:30:00"), type: "expense", categoryName: "Saúde" },
        { description: "Internet", amount: 109.90, date: new Date("2023-04-20T08:00:00"), type: "expense", categoryName: "Contas Fixas" },
        { description: "Restaurante", amount: 120.00, date: new Date("2023-04-19T19:30:00"), type: "expense", categoryName: "Alimentação" },
        { description: "Uber", amount: 32.50, date: new Date("2023-04-18T22:15:00"), type: "expense", categoryName: "Transporte" },
        { description: "Freelance", amount: 1200.00, date: new Date("2023-04-15T14:00:00"), type: "income", categoryName: "Receita" },
      ];

      for (const transaction of transactions) {
        const categoryId = categoryMap[transaction.categoryName];
        if (categoryId) {
          await db.insert(schema.transactions).values({
            userId: user.id,
            categoryId,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
            isRecurring: false,
          });
        }
      }
      console.log("Sample transactions created");
    } else {
      console.log("Transactions already exist");
    }

    // Check if financial goals exist
    const existingGoals = await db.query.goals.findMany({
      where: eq(schema.goals.userId, user.id),
    });

    if (existingGoals.length === 0) {
      console.log("Creating financial goals...");
      
      // Sample goals
      const goals = [
        { name: "Viagem para Europa", target: 21000, currentAmount: 15750, deadline: new Date("2023-12-31"), category: "viagem", notes: "Férias de final de ano" },
        { name: "Entrada Apartamento", target: 50000, currentAmount: 11500, deadline: new Date("2024-06-30"), category: "imovel", notes: "Apartamento de 2 quartos" },
        { name: "MBA Finanças", target: 24000, currentAmount: 10800, deadline: new Date("2024-02-28"), category: "educacao", notes: "Especialização profissional" },
      ];

      for (const goal of goals) {
        await db.insert(schema.goals).values({
          userId: user.id,
          name: goal.name,
          target: goal.target,
          currentAmount: goal.currentAmount,
          deadline: goal.deadline,
          category: goal.category,
          notes: goal.notes,
        });
      }
      console.log("Financial goals created");
    } else {
      console.log("Financial goals already exist");
    }

    // Check if investments exist
    const existingInvestments = await db.query.investments.findMany({
      where: eq(schema.investments.userId, user.id),
    });

    if (existingInvestments.length === 0) {
      console.log("Creating investments...");
      
      // Sample investments
      const investments = [
        { name: "Tesouro Direto", type: "fixed_income", value: 15000, initialValue: 10000, initialDate: new Date("2022-05-15"), institution: "banco_brasil", returnRate: 12.5, notes: "Tesouro IPCA+ 2026" },
        { name: "Ações PETR4", type: "stocks", value: 9500, initialValue: 10000, initialDate: new Date("2022-03-10"), institution: "xp", returnRate: -5, notes: "Petrobras PN" },
        { name: "Fundo Imobiliário XYZ", type: "real_estate", value: 7800, initialValue: 5000, initialDate: new Date("2021-11-20"), institution: "btg", returnRate: 56, notes: "FII de shoppings" },
      ];

      for (const investment of investments) {
        await db.insert(schema.investments).values({
          userId: user.id,
          name: investment.name,
          type: investment.type,
          value: investment.value,
          initialValue: investment.initialValue,
          initialDate: investment.initialDate,
          institution: investment.institution,
          returnRate: investment.returnRate,
          notes: investment.notes,
        });
      }
      console.log("Investments created");
    } else {
      console.log("Investments already exist");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
