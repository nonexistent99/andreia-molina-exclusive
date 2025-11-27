import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products/Packages table
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priceInCents: int("priceInCents").notNull(), // Preço em centavos para evitar problemas com decimais
  originalPriceInCents: int("originalPriceInCents"), // Preço original para mostrar desconto
  imageUrl: text("imageUrl"),
  features: text("features").notNull(), // JSON string com lista de features
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  orderBumpId: int("orderBumpId"), // Order bump vinculado a este produto
  accessLink: text("accessLink"), // Link de acesso ao conteúdo após compra
  downloadUrl: text("downloadUrl"), // URL do arquivo no S3
  fileKey: text("fileKey"), // Chave do arquivo no S3
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  productId: int("productId").notNull(),
  orderBumpId: int("orderBumpId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  customerDocument: varchar("customerDocument", { length: 14 }),
  amountInCents: int("amountInCents").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "cancelled", "expired"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).default("pix").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Payment transactions table (for Lxpay integration)
 */
export const paymentTransactions = mysqlTable("paymentTransactions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(), // ID da transação no Lxpay
  pixCode: text("pixCode"), // Código Pix copia e cola
  pixQrCode: text("pixQrCode"), // URL ou base64 do QR Code
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  amountInCents: int("amountInCents").notNull(),
  expiresAt: timestamp("expiresAt"),
  webhookData: text("webhookData"), // JSON com dados do webhook
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

/**
 * Download links table (temporary links sent via email)
 */
export const downloadLinks = mysqlTable("downloadLinks", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  productId: int("productId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  maxDownloads: int("maxDownloads").default(3).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastAccessedAt: timestamp("lastAccessedAt"),
});

export type DownloadLink = typeof downloadLinks.$inferSelect;
export type InsertDownloadLink = typeof downloadLinks.$inferInsert;

/**
 * Email logs table (to track sent emails)
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  emailType: varchar("emailType", { length: 50 }).notNull(), // 'order_confirmation', 'download_link', etc
  status: mysqlEnum("status", ["sent", "failed", "pending"]).default("pending").notNull(),
  brevoMessageId: varchar("brevoMessageId", { length: 255 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Admins table (simple user/password authentication)
 */
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

/**
 * Models table (for multiple model pages)
 */
export const models = mysqlTable("models", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly name
  title: varchar("title", { length: 255 }).notNull(), // Hero title
  subtitle: text("subtitle"), // Hero subtitle
  description: text("description"), // About section
  primaryColor: varchar("primaryColor", { length: 7 }).default("#FF0066").notNull(), // Hex color
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#9333EA").notNull(),
  accentColor: varchar("accentColor", { length: 7 }).default("#FF0066").notNull(),
  heroImageUrl: text("heroImageUrl"),
  aboutImageUrl: text("aboutImageUrl"),
  instagramUrl: varchar("instagramUrl", { length: 255 }), // Link do Instagram da modelo
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Model = typeof models.$inferSelect;
export type InsertModel = typeof models.$inferInsert;

/**
 * Model products (products specific to each model)
 */
export const modelProducts = mysqlTable("modelProducts", {
  id: int("id").autoincrement().primaryKey(),
  modelId: int("modelId").notNull(),
  productId: int("productId").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  customPrice: int("customPrice"), // Override price for this model
  customName: varchar("customName", { length: 255 }), // Override name
  customDescription: text("customDescription"), // Override description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModelProduct = typeof modelProducts.$inferSelect;
export type InsertModelProduct = typeof modelProducts.$inferInsert;

/**
 * Order Bumps table (additional offers in checkout)
 */
export const orderBumps = mysqlTable("orderBumps", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priceInCents: int("priceInCents").notNull(),
  originalPriceInCents: int("originalPriceInCents"),
  imageUrl: text("imageUrl"),
  accessLink: text("accessLink"), // Link de acesso ao conteúdo do order bump
  deliveryDescription: text("deliveryDescription"), // Descrição do que será entregue
  modelId: int("modelId"), // Null = global, or specific to a model
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrderBump = typeof orderBumps.$inferSelect;
export type InsertOrderBump = typeof orderBumps.$inferInsert;

// ** Nova Tabela para Múltiplos Order Bumps (Relacionamento N:M) **
export const orderOrderBumps = mysqlTable("orderOrderBumps", {
  orderId: int("orderId")
    .references(() => orders.id)
    .notNull(),
  orderBumpId: int("orderBumpId")
    .references(() => orderBumps.id)
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.orderId, t.orderBumpId] }),
}));
