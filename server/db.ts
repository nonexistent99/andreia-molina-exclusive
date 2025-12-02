import { eq, and, desc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  products, 
  Product, 
  InsertProduct,
  orders,
  Order,
  InsertOrder,
  paymentTransactions,
  PaymentTransaction,
  InsertPaymentTransaction,
  downloadLinks,
  DownloadLink,
  InsertDownloadLink,
  emailLogs,
  EmailLog,
  InsertEmailLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Products
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.isFeatured));
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductOrderBump(productId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Buscar produto para pegar o orderBumpId
  const product = await getProductById(productId);
  if (!product || !product.orderBumpId) return null;
  
  // Buscar order bump
  const { orderBumps } = await import("../drizzle/schema");
  const result = await db.select().from(orderBumps).where(eq(orderBumps.id, product.orderBumpId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductOrderBumps(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Buscar produto para pegar os orderBumpIds
  const product = await getProductById(productId);
  if (!product || !product.orderBumpIds) return [];
  
  // Parse orderBumpIds (que vem como string JSON)
  let orderBumpIds: number[] = [];
  try {
    orderBumpIds = JSON.parse(product.orderBumpIds as string);
  } catch {
    return [];
  }
  
  if (orderBumpIds.length === 0) return [];
  
  // Buscar todos os order bumps
  const { orderBumps } = await import("../drizzle/schema");
  
  const result = await db.select().from(orderBumps).where(inArray(orderBumps.id, orderBumpIds));
  return result;
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  const insertedId = Number(result[0].insertId);
  const created = await getProductById(insertedId);
  if (!created) throw new Error("Failed to create product");
  return created;
}

// Orders
export async function createOrder(order: InsertOrder): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  const insertedId = Number(result[0].insertId);
  const created = await getOrderById(insertedId);
  if (!created) throw new Error("Failed to create order");
  return created;
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateOrderStatus(orderId: number, status: Order['status'], paidAt?: Date): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Partial<Order> = { status };
  if (paidAt) {
    updateData.paidAt = paidAt;
  }
  
  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

// Payment Transactions
export async function createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(paymentTransactions).values(transaction);
  const insertedId = Number(result[0].insertId);
  const created = await getPaymentTransactionById(insertedId);
  if (!created) throw new Error("Failed to create payment transaction");
  return created;
}

export async function getPaymentTransactionById(id: number): Promise<PaymentTransaction | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPaymentTransactionByOrderId(orderId: number): Promise<PaymentTransaction | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePaymentTransactionStatus(id: number, status: PaymentTransaction['status'], webhookData?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Partial<PaymentTransaction> = { status };
  if (webhookData) {
    updateData.webhookData = webhookData;
  }
  
  await db.update(paymentTransactions).set(updateData).where(eq(paymentTransactions.id, id));
}

// Download Links
export async function createDownloadLink(link: InsertDownloadLink): Promise<DownloadLink> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(downloadLinks).values(link);
  const insertedId = Number(result[0].insertId);
  const created = await getDownloadLinkById(insertedId);
  if (!created) throw new Error("Failed to create download link");
  return created;
}

export async function getDownloadLinkById(id: number): Promise<DownloadLink | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(downloadLinks).where(eq(downloadLinks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDownloadLinkByToken(token: string): Promise<DownloadLink | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(downloadLinks).where(
    and(
      eq(downloadLinks.token, token),
      eq(downloadLinks.isActive, true)
    )
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function incrementDownloadCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const link = await getDownloadLinkById(id);
  if (!link) throw new Error("Download link not found");
  
  const newCount = link.downloadCount + 1;
  const updateData: Partial<DownloadLink> = {
    downloadCount: newCount,
    lastAccessedAt: new Date()
  };
  
  if (newCount >= link.maxDownloads) {
    updateData.isActive = false;
  }
  
  await db.update(downloadLinks).set(updateData).where(eq(downloadLinks.id, id));
}

// Email Logs
export async function createEmailLog(log: InsertEmailLog): Promise<EmailLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(emailLogs).values(log);
  const insertedId = Number(result[0].insertId);
  const created = await getEmailLogById(insertedId);
  if (!created) throw new Error("Failed to create email log");
  return created;
}

export async function getEmailLogById(id: number): Promise<EmailLog | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(emailLogs).where(eq(emailLogs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateEmailLogStatus(id: number, status: EmailLog['status'], brevoMessageId?: string, errorMessage?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Partial<EmailLog> = { status };
  if (brevoMessageId) {
    updateData.brevoMessageId = brevoMessageId;
  }
  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }
