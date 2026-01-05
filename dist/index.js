var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  downloadLinks: () => downloadLinks,
  emailLogs: () => emailLogs,
  modelProducts: () => modelProducts,
  models: () => models,
  orderBumps: () => orderBumps,
  orderOrderBumps: () => orderOrderBumps,
  orders: () => orders,
  paymentTransactions: () => paymentTransactions,
  products: () => products,
  users: () => users
});
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
var users, products, orders, paymentTransactions, downloadLinks, emailLogs, admins, models, modelProducts, orderBumps, orderOrderBumps;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description").notNull(),
      priceInCents: int("priceInCents").notNull(),
      // Preço em centavos para evitar problemas com decimais
      originalPriceInCents: int("originalPriceInCents"),
      // Preço original para mostrar desconto
      imageUrl: text("imageUrl"),
      features: text("features").notNull(),
      // JSON string com lista de features
      isFeatured: boolean("isFeatured").default(false).notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      orderBumpIds: text("orderBumpIds"),
      accessLink: text("accessLink"),
      // Link de acesso ao conteúdo após compra
      downloadUrl: text("downloadUrl"),
      // URL do arquivo no S3
      fileKey: text("fileKey"),
      // Chave do arquivo no S3
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    orders = mysqlTable("orders", {
      id: int("id").autoincrement().primaryKey(),
      orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
      productId: int("productId").notNull(),
      orderBumpIds: text("orderBumpIds"),
      customerName: varchar("customerName", { length: 255 }).notNull(),
      customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
      customerPhone: varchar("customerPhone", { length: 20 }),
      customerDocument: varchar("customerDocument", { length: 14 }),
      amountInCents: int("amountInCents").notNull(),
      status: mysqlEnum("status", ["pending", "paid", "cancelled", "expired"]).default("pending").notNull(),
      paymentMethod: varchar("paymentMethod", { length: 50 }).default("pix").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      paidAt: timestamp("paidAt")
    });
    paymentTransactions = mysqlTable("paymentTransactions", {
      id: int("id").autoincrement().primaryKey(),
      orderId: int("orderId").notNull(),
      transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
      // ID da transação no Lxpay
      pixCode: text("pixCode"),
      // Código Pix copia e cola
      pixQrCode: text("pixQrCode"),
      // URL ou base64 do QR Code
      status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
      amountInCents: int("amountInCents").notNull(),
      expiresAt: timestamp("expiresAt"),
      webhookData: text("webhookData"),
      // JSON com dados do webhook
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    downloadLinks = mysqlTable("downloadLinks", {
      id: int("id").autoincrement().primaryKey(),
      orderId: int("orderId").notNull(),
      token: varchar("token", { length: 128 }).notNull().unique(),
      productId: int("productId").notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      downloadCount: int("downloadCount").default(0).notNull(),
      maxDownloads: int("maxDownloads").default(3).notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      lastAccessedAt: timestamp("lastAccessedAt")
    });
    emailLogs = mysqlTable("emailLogs", {
      id: int("id").autoincrement().primaryKey(),
      orderId: int("orderId").notNull(),
      recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
      emailType: varchar("emailType", { length: 50 }).notNull(),
      // 'order_confirmation', 'download_link', etc
      status: mysqlEnum("status", ["sent", "failed", "pending"]).default("pending").notNull(),
      brevoMessageId: varchar("brevoMessageId", { length: 255 }),
      errorMessage: text("errorMessage"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    admins = mysqlTable("admins", {
      id: int("id").autoincrement().primaryKey(),
      username: varchar("username", { length: 50 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      // Hashed password
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      lastLoginAt: timestamp("lastLoginAt")
    });
    models = mysqlTable("models", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      // URL-friendly name
      title: varchar("title", { length: 255 }).notNull(),
      // Hero title
      subtitle: text("subtitle"),
      // Hero subtitle
      description: text("description"),
      // About section
      primaryColor: varchar("primaryColor", { length: 7 }).default("#FF0066").notNull(),
      // Hex color
      secondaryColor: varchar("secondaryColor", { length: 7 }).default("#9333EA").notNull(),
      accentColor: varchar("accentColor", { length: 7 }).default("#FF0066").notNull(),
      heroImageUrl: text("heroImageUrl"),
      aboutImageUrl: text("aboutImageUrl"),
      instagramUrl: varchar("instagramUrl", { length: 255 }),
      // Link do Instagram da modelo
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    modelProducts = mysqlTable("modelProducts", {
      id: int("id").autoincrement().primaryKey(),
      modelId: int("modelId").notNull(),
      productId: int("productId").notNull(),
      displayOrder: int("displayOrder").default(0).notNull(),
      customPrice: int("customPrice"),
      // Override price for this model
      customName: varchar("customName", { length: 255 }),
      // Override name
      customDescription: text("customDescription"),
      // Override description
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    orderBumps = mysqlTable("orderBumps", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description").notNull(),
      priceInCents: int("priceInCents").notNull(),
      originalPriceInCents: int("originalPriceInCents"),
      imageUrl: text("imageUrl"),
      accessLink: text("accessLink"),
      // Link de acesso ao conteúdo do order bump
      deliveryDescription: text("deliveryDescription"),
      // Descrição do que será entregue
      modelId: int("modelId"),
      // Null = global, or specific to a model
      isActive: boolean("isActive").default(true).notNull(),
      displayOrder: int("displayOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    orderOrderBumps = mysqlTable("orderOrderBumps", {
      orderId: int("orderId").references(() => orders.id).notNull(),
      orderBumpId: int("orderBumpId").references(() => orderBumps.id).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    }, (t2) => ({
      pk: primaryKey({ columns: [t2.orderId, t2.orderBumpId] })
    }));
  }
});

// server/_core/index.ts
import "dotenv/config";
import express9 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/db.ts
init_schema();
import { eq, and, desc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.isFeatured));
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductOrderBump(productId) {
  const db = await getDb();
  if (!db) return null;
  const product = await getProductById(productId);
  if (!product || !product.orderBumpId) return null;
  const { orderBumps: orderBumps2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.select().from(orderBumps2).where(eq(orderBumps2.id, product.orderBumpId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function getProductOrderBumps(productId) {
  const db = await getDb();
  if (!db) return [];
  const product = await getProductById(productId);
  if (!product || !product.orderBumpIds) return [];
  let orderBumpIds = [];
  try {
    orderBumpIds = JSON.parse(product.orderBumpIds);
  } catch {
    return [];
  }
  if (orderBumpIds.length === 0) return [];
  const { orderBumps: orderBumps2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.select().from(orderBumps2).where(inArray(orderBumps2.id, orderBumpIds));
  return result;
}
async function createOrder(order) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  const insertedId = Number(result[0].insertId);
  const created = await getOrderById(insertedId);
  if (!created) throw new Error("Failed to create order");
  return created;
}
async function getOrderById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getOrderByNumber(orderNumber) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateOrderStatus(orderId, status, paidAt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { status };
  if (paidAt) {
    updateData.paidAt = paidAt;
  }
  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}
async function createPaymentTransaction(transaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(paymentTransactions).values(transaction);
  const insertedId = Number(result[0].insertId);
  const created = await getPaymentTransactionById(insertedId);
  if (!created) throw new Error("Failed to create payment transaction");
  return created;
}
async function getPaymentTransactionById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getPaymentTransactionByOrderId(orderId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getPaymentTransactionByTransactionId(transactionId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.transactionId, transactionId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updatePaymentTransactionStatus(id, status, webhookData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { status };
  if (webhookData) {
    updateData.webhookData = webhookData;
  }
  await db.update(paymentTransactions).set(updateData).where(eq(paymentTransactions.id, id));
}
async function createDownloadLink(link) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(downloadLinks).values(link);
  const insertedId = Number(result[0].insertId);
  const created = await getDownloadLinkById(insertedId);
  if (!created) throw new Error("Failed to create download link");
  return created;
}
async function getDownloadLinkById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(downloadLinks).where(eq(downloadLinks.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getDownloadLinkByToken(token) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(downloadLinks).where(
    and(
      eq(downloadLinks.token, token),
      eq(downloadLinks.isActive, true)
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function incrementDownloadCount(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const link = await getDownloadLinkById(id);
  if (!link) throw new Error("Download link not found");
  const newCount = link.downloadCount + 1;
  const updateData = {
    downloadCount: newCount,
    lastAccessedAt: /* @__PURE__ */ new Date()
  };
  if (newCount >= link.maxDownloads) {
    updateData.isActive = false;
  }
  await db.update(downloadLinks).set(updateData).where(eq(downloadLinks.id, id));
}
async function createEmailLog(log) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(emailLogs).values(log);
  const insertedId = Number(result[0].insertId);
  const created = await getEmailLogById(insertedId);
  if (!created) throw new Error("Failed to create email log");
  return created;
}
async function getEmailLogById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(emailLogs).where(eq(emailLogs.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/routers.ts
import { nanoid } from "nanoid";

// server/lxpay.ts
import axios from "axios";
import QRCode from "qrcode";
var LXPAY_API_URL = "https://api.lxpay.com.br/api/v1/gateway/pix/receive";
async function createPixCharge(params) {
  const apiKey = process.env.LXPAY_API_KEY;
  const apiSecret = process.env.LXPAY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("LXPAY_API_KEY ou LXPAY_API_SECRET n\xE3o configuradas");
  }
  try {
    const payload = {
      amount: Math.round(params.amount) / 100,
      // Converter centavos para reais
      client: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "",
        document: params.customerDocument || ""
      },
      identifier: params.orderId,
      ...params.description && { description: params.description },
      ...params.callbackUrl && { callbackUrl: params.callbackUrl }
    };
    console.log("[Lxpay] Enviando requisi\xE7\xE3o para criar PIX:", {
      orderId: params.orderId,
      amount: params.amount,
      url: LXPAY_API_URL
    });
    const response = await axios.post(LXPAY_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-public-key": apiKey,
        "x-secret-key": apiSecret
      },
      timeout: 1e4
    });
    console.log("[Lxpay] Resposta recebida com sucesso:", {
      transactionId: response.data.transactionId,
      status: response.data.status
    });
    const transactionId = response.data.transactionId;
    const status = response.data.status;
    const pixData = response.data.pix;
    if (!pixData) {
      console.error("[Lxpay] Resposta sem dados PIX:", response.data);
      throw new Error("Resposta da Lxpay n\xE3o cont\xE9m dados PIX");
    }
    const pixCode = pixData.code || pixData.copyPaste || pixData.qrCode || "";
    if (!pixCode) {
      console.error("[Lxpay] Nenhum c\xF3digo PIX encontrado em:", pixData);
      throw new Error("C\xF3digo PIX n\xE3o encontrado na resposta da Lxpay");
    }
    console.log("[Lxpay] C\xF3digo PIX obtido, gerando QR code...");
    let pixQrCode = "";
    try {
      pixQrCode = await QRCode.toDataURL(pixCode, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      console.log("[Lxpay] QR code gerado com sucesso");
    } catch (qrError) {
      console.error("[Lxpay] Erro ao gerar QR code:", qrError);
    }
    const expiresAt = pixData.expiresAt || "";
    return {
      transactionId,
      pixCode,
      pixQrCode,
      expiresAt,
      status
    };
  } catch (error) {
    console.error("[Lxpay] Erro ao criar cobran\xE7a PIX:", error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message;
      const statusCode = error.response?.status;
      console.error("[Lxpay] Status HTTP:", statusCode);
      console.error("[Lxpay] Dados de erro:", errorData);
      if (statusCode === 401) {
        throw new Error("Erro Lxpay: Autentica\xE7\xE3o falhou. Verifique suas credenciais (public-key e secret-key).");
      } else if (statusCode === 400) {
        throw new Error(`Erro Lxpay: Requisi\xE7\xE3o inv\xE1lida. ${errorMessage}`);
      } else if (statusCode === 500) {
        throw new Error(`Erro Lxpay: Erro interno do servidor. ${errorMessage}`);
      } else {
        throw new Error(`Erro Lxpay (${statusCode}): ${errorMessage}`);
      }
    }
    throw new Error(`Erro ao criar cobran\xE7a PIX: ${error instanceof Error ? error.message : String(error)}`);
  }
}
function processWebhook(payload) {
  const statusMap = {
    pending: "pending",
    completed: "completed",
    paid: "completed",
    failed: "failed",
    cancelled: "cancelled",
    ok: "completed"
  };
  return {
    transactionId: payload.transactionId,
    status: statusMap[payload.status?.toLowerCase()] || "pending",
    paidAt: payload.paidAt ? new Date(payload.paidAt) : void 0
  };
}

// server/brevo.ts
import axios2 from "axios";
var BREVO_API_URL = "https://api.brevo.com/v3";
async function sendEmail(params) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY n\xE3o configurada");
  }
  try {
    const response = await axios2.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: "Andreia Molina Exclusive",
          email: "noreply@andreiamolina.com"
          // Ajustar para email verificado
        },
        to: [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent
      },
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": apiKey
        }
      }
    );
    return {
      messageId: response.data.messageId
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    if (axios2.isAxiosError(error)) {
      throw new Error(`Erro Brevo: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}
function getOrderConfirmationEmailTemplate(data) {
  const subject = `Pedido Confirmado - ${data.orderNumber}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pedido Confirmado! \u{1F389}</h1>
        </div>
        <div class="content">
          <p>Ol\xE1 <strong>${data.customerName}</strong>,</p>
          <p>Seu pedido foi confirmado com sucesso!</p>
          <p><strong>N\xFAmero do Pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Produto:</strong> ${data.productName}</p>
          <p><strong>Valor:</strong> R$ ${(data.amount / 100).toFixed(2)}</p>
          <p>Aguardando confirma\xE7\xE3o do pagamento via Pix. Assim que o pagamento for confirmado, voc\xEA receber\xE1 um novo email com o link para download do seu conte\xFAdo exclusivo.</p>
          <p>O link de pagamento expira em 30 minutos.</p>
        </div>
        <div class="footer">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const textContent = `
    Pedido Confirmado!
    
    Ol\xE1 ${data.customerName},
    
    Seu pedido foi confirmado com sucesso!
    
    N\xFAmero do Pedido: ${data.orderNumber}
    Produto: ${data.productName}
    Valor: R$ ${(data.amount / 100).toFixed(2)}
    
    Aguardando confirma\xE7\xE3o do pagamento via Pix. Assim que o pagamento for confirmado, voc\xEA receber\xE1 um novo email com o link para download do seu conte\xFAdo exclusivo.
    
    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.
  `;
  return { subject, htmlContent, textContent };
}
function getDownloadLinkEmailTemplate(data) {
  const subject = `Seu Conte\xFAdo Exclusivo Est\xE1 Pronto! - ${data.orderNumber}`;
  const expirationDate = data.expiresAt.toLocaleDateString("pt-BR");
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>\u2728 Pagamento Confirmado! \u2728</h1>
        </div>
        <div class="content">
          <p>Ol\xE1 <strong>${data.customerName}</strong>,</p>
          <p>Seu pagamento foi confirmado e seu conte\xFAdo exclusivo est\xE1 pronto para download!</p>
          <p><strong>Pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Produto:</strong> ${data.productName}</p>
          <div style="text-align: center;">
            <a href="${data.downloadLink}" class="button">BAIXAR CONTE\xDADO AGORA</a>
          </div>
          <div class="warning">
            <strong>\u26A0\uFE0F Importante:</strong>
            <ul>
              <li>Este link expira em: <strong>${expirationDate}</strong></li>
              <li>Voc\xEA pode fazer at\xE9 3 downloads</li>
              <li>Salve o conte\xFAdo em um local seguro</li>
              <li>N\xE3o compartilhe este link com outras pessoas</li>
            </ul>
          </div>
          <p>Aproveite seu conte\xFAdo exclusivo! \u{1F389}</p>
          <p>Se tiver alguma d\xFAvida, entre em contato conosco.</p>
        </div>
        <div class="footer">
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const textContent = `
    Pagamento Confirmado!
    
    Ol\xE1 ${data.customerName},
    
    Seu pagamento foi confirmado e seu conte\xFAdo exclusivo est\xE1 pronto para download!
    
    Pedido: ${data.orderNumber}
    Produto: ${data.productName}
    
    Link para Download:
    ${data.downloadLink}
    
    IMPORTANTE:
    - Este link expira em: ${expirationDate}
    - Voc\xEA pode fazer at\xE9 3 downloads
    - Salve o conte\xFAdo em um local seguro
    - N\xE3o compartilhe este link com outras pessoas
    
    Aproveite seu conte\xFAdo exclusivo!
    
    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Andreia Molina Exclusive. Todos os direitos reservados.
  `;
  return { subject, htmlContent, textContent };
}

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getProductById(input.id);
    }),
    getOrderBump: publicProcedure.input(z2.object({ productId: z2.number() })).query(async ({ input }) => {
      return await getProductOrderBump(input.productId);
    }),
    getOrderBumps: publicProcedure.input(z2.object({ productId: z2.number() })).query(async ({ input }) => {
      return await getProductOrderBumps(input.productId);
    })
  }),
  orders: router({
    create: publicProcedure.input(z2.object({
      productId: z2.number(),
      customerName: z2.string().min(1),
      customerEmail: z2.string().email(),
      customerPhone: z2.string().optional(),
      customerDocument: z2.string().min(11),
      orderBumpIds: z2.array(z2.number()).optional()
    })).mutation(async ({ input }) => {
      console.log("[DEBUG orders.create] Input recebido:", JSON.stringify(input, null, 2));
      const product = await getProductById(input.productId);
      if (!product) {
        throw new Error("Produto n\xE3o encontrado");
      }
      const orderNumber = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;
      let totalAmount = product.priceInCents;
      console.log("[DEBUG orders.create] Valor base:", totalAmount, "centavos");
      console.log("[DEBUG orders.create] Order bumps recebidos:", input.orderBumpIds);
      if (input.orderBumpIds && input.orderBumpIds.length > 0) {
        for (const obId of input.orderBumpIds) {
          const orderBump = await getProductById(obId);
          if (orderBump) {
            console.log(`[DEBUG orders.create] Adicionando order bump ${obId}: +${orderBump.priceInCents} centavos`);
            totalAmount += orderBump.priceInCents;
          } else {
            console.log(`[DEBUG orders.create] Order bump ${obId} n\xE3o encontrado!`);
          }
        }
      }
      const order = await createOrder({
        orderNumber,
        productId: input.productId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone || null,
        customerDocument: input.customerDocument || null,
        orderBumpIds: input.orderBumpIds && input.orderBumpIds.length > 0 ? JSON.stringify(input.orderBumpIds) : null,
        amountInCents: totalAmount,
        status: "pending",
        paymentMethod: "pix"
      });
      console.log("[DEBUG orders.create] Pedido criado:", { orderNumber, amountInCents: totalAmount, orderBumpIds: input.orderBumpIds });
      try {
        const emailTemplate = getOrderConfirmationEmailTemplate({
          customerName: input.customerName,
          orderNumber: order.orderNumber,
          productName: product.name,
          amount: product.priceInCents
        });
        const emailResult = await sendEmail({
          to: {
            email: input.customerEmail,
            name: input.customerName
          },
          subject: emailTemplate.subject,
          htmlContent: emailTemplate.htmlContent,
          textContent: emailTemplate.textContent
        });
        await createEmailLog({
          orderId: order.id,
          recipientEmail: input.customerEmail,
          emailType: "order_confirmation",
          status: "sent",
          brevoMessageId: emailResult.messageId
        });
      } catch (error) {
        console.error("Erro ao enviar email de confirma\xE7\xE3o:", error);
      }
      return {
        order,
        product
      };
    }),
    getByNumber: publicProcedure.input(z2.object({ orderNumber: z2.string() })).query(async ({ input }) => {
      return await getOrderByNumber(input.orderNumber);
    }),
    success: publicProcedure.input(z2.object({ orderNumber: z2.string() })).query(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) throw new Error("Pedido n\xE3o encontrado");
      const product = await getProductById(order.productId);
      if (!product) throw new Error("Produto n\xE3o encontrado");
      const productDownloadLink = await (void 0)(order.id, order.productId);
      let orderBumpDownloadLink = null;
      let orderBumpProduct = null;
      if (order.orderBumpId) {
        orderBumpProduct = await getProductById(order.orderBumpId);
        orderBumpDownloadLink = await (void 0)(order.id, order.orderBumpId);
      }
      return {
        productName: product.name,
        productAccessLink: productDownloadLink?.accessLink || null,
        orderBumpName: orderBumpProduct?.name || null,
        orderBumpAccessLink: orderBumpDownloadLink?.accessLink || null,
        hasOrderBump: !!order.orderBumpId
      };
    })
  }),
  downloads: router({
    validate: publicProcedure.input(z2.object({ token: z2.string() })).query(async ({ input }) => {
      const downloadLink = await getDownloadLinkByToken(input.token);
      if (!downloadLink) {
        throw new Error("Link de download n\xE3o encontrado");
      }
      if (!downloadLink.isActive) {
        throw new Error("Link de download inativo");
      }
      if (new Date(downloadLink.expiresAt) < /* @__PURE__ */ new Date()) {
        throw new Error("Link de download expirado");
      }
      if (downloadLink.downloadCount >= downloadLink.maxDownloads) {
        throw new Error("Limite de downloads atingido");
      }
      const product = await getProductById(downloadLink.productId);
      if (!product) {
        throw new Error("Produto n\xE3o encontrado");
      }
      return {
        ...downloadLink,
        product
      };
    }),
    download: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input }) => {
      const downloadLink = await getDownloadLinkByToken(input.token);
      if (!downloadLink) {
        throw new Error("Link de download n\xE3o encontrado");
      }
      if (!downloadLink.isActive || new Date(downloadLink.expiresAt) < /* @__PURE__ */ new Date()) {
        throw new Error("Link de download inv\xE1lido ou expirado");
      }
      if (downloadLink.downloadCount >= downloadLink.maxDownloads) {
        throw new Error("Limite de downloads atingido");
      }
      await incrementDownloadCount(downloadLink.id);
      const product = await getProductById(downloadLink.productId);
      if (!product || !product.downloadUrl) {
        throw new Error("Arquivo n\xE3o dispon\xEDvel");
      }
      return {
        downloadUrl: product.downloadUrl
      };
    })
  }),
  payment: router({
    createPixCharge: publicProcedure.input(z2.object({ orderNumber: z2.string() })).mutation(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) {
        throw new Error("Pedido n\xE3o encontrado");
      }
      const product = await getProductById(order.productId);
      if (!product) {
        throw new Error("Produto n\xE3o encontrado");
      }
      const existingTransaction = await getPaymentTransactionByOrderId(order.id);
      if (existingTransaction && existingTransaction.status === "pending") {
        return {
          transactionId: existingTransaction.transactionId,
          pixCode: existingTransaction.pixCode,
          pixQrCode: existingTransaction.pixQrCode,
          expiresAt: existingTransaction.expiresAt
        };
      }
      console.log("[DEBUG payment.createPixCharge] Criando PIX para pedido:", { orderNumber: order.orderNumber, amountInCents: order.amountInCents });
      const pixCharge = await createPixCharge({
        amount: order.amountInCents,
        // ✅ CORRETO: Enviar em centavos
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || void 0,
        customerDocument: order.customerDocument || void 0,
        orderId: order.orderNumber,
        description: `Compra: ${product.name}`
      });
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);
      await createPaymentTransaction({
        orderId: order.id,
        transactionId: pixCharge.transactionId,
        pixCode: pixCharge.pixCode,
        pixQrCode: pixCharge.pix?.code || pixCharge.pixQrCode || "",
        status: "pending",
        amountInCents: order.amountInCents,
        expiresAt
      });
      return {
        transactionId: pixCharge.transactionId,
        pixCode: pixCharge.pixCode,
        pixQrCode: pixCharge.pixQrCode,
        expiresAt
      };
    }),
    checkStatus: publicProcedure.input(z2.object({ orderNumber: z2.string() })).query(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) {
        throw new Error("Pedido n\xE3o encontrado");
      }
      const transaction = await getPaymentTransactionByOrderId(order.id);
      if (!transaction) {
        return { status: order.status };
      }
      if (transaction.status === "pending") {
        try {
          const paymentStatus = await (void 0)(transaction.transactionId);
          if (paymentStatus.status === "completed") {
            await updatePaymentTransactionStatus(transaction.id, "completed");
            await updateOrderStatus(order.id, "paid", /* @__PURE__ */ new Date());
            return { status: "paid" };
          }
        } catch (error) {
          console.error("Erro ao verificar status do pagamento:", error);
        }
      }
      return { status: order.status };
    })
  })
});
async function handleLxpayWebhook(payload) {
  try {
    const webhookData = processWebhook(payload);
    console.log("[Webhook] Dados processados:", webhookData);
    const transaction = await getPaymentTransactionByTransactionId(webhookData.transactionId);
    if (!transaction) {
      console.error("Transa\xE7\xE3o n\xE3o encontrada para transactionId:", webhookData.transactionId);
      throw new Error(`Transa\xE7\xE3o n\xE3o encontrada: ${webhookData.transactionId}`);
    }
    console.log("[Webhook] Transa\xE7\xE3o encontrada:", { id: transaction.id, orderId: transaction.orderId });
    await updatePaymentTransactionStatus(
      transaction.id,
      webhookData.status,
      JSON.stringify(payload)
    );
    if (webhookData.status === "completed") {
      const order = await getOrderById(transaction.orderId);
      if (!order) return;
      await updateOrderStatus(order.id, "paid", webhookData.paidAt);
      const downloadToken = nanoid(32);
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      const downloadLink = await createDownloadLink({
        orderId: order.id,
        token: downloadToken,
        productId: order.productId,
        expiresAt,
        downloadCount: 0,
        maxDownloads: 3,
        isActive: true
      });
      const product = await getProductById(order.productId);
      if (!product) return;
      let orderBumpIds = [];
      if (order.orderBumpIds) {
        try {
          orderBumpIds = JSON.parse(order.orderBumpIds);
        } catch (e) {
          console.error("[Webhook] Erro ao fazer parse de orderBumpIds:", e);
        }
      }
      for (const orderBumpId of orderBumpIds) {
        const bumToken = nanoid(32);
        const bumExpiresAt = /* @__PURE__ */ new Date();
        bumExpiresAt.setDate(bumExpiresAt.getDate() + 30);
        await createDownloadLink({
          orderId: order.id,
          token: bumToken,
          productId: orderBumpId,
          expiresAt: bumExpiresAt,
          downloadCount: 0,
          maxDownloads: 3,
          isActive: true
        });
      }
      const downloadUrl = `${process.env.VITE_APP_URL || "https://andreiamolina.com"}/download/${downloadToken}`;
      const emailTemplate = getDownloadLinkEmailTemplate({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        productName: product.name,
        downloadLink: downloadUrl,
        expiresAt: downloadLink.expiresAt
      });
      try {
        const emailResult = await sendEmail({
          to: {
            email: order.customerEmail,
            name: order.customerName
          },
          subject: emailTemplate.subject,
          htmlContent: emailTemplate.htmlContent,
          textContent: emailTemplate.textContent
        });
        await createEmailLog({
          orderId: order.id,
          recipientEmail: order.customerEmail,
          emailType: "download_link",
          status: "sent",
          brevoMessageId: emailResult.messageId
        });
        console.log("[Webhook] Email de download enviado com sucesso para:", order.customerEmail);
      } catch (error) {
        console.error("Erro ao enviar email com link de download:", error);
        await createEmailLog({
          orderId: order.id,
          recipientEmail: order.customerEmail,
          emailType: "download_link",
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Erro desconhecido"
        });
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    throw error;
  }
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios3 from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios3.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "production" ? "/workspace/dist/public" : path.resolve(import.meta.dirname, "../..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/webhook.ts
import { Router } from "express";
var router2 = Router();
router2.post("/lxpay", async (req, res) => {
  try {
    console.log("[Webhook] Received Lxpay webhook:", req.body);
    if (!req.body || !req.body.transactionId) {
      console.warn("[Webhook] Webhook inv\xE1lido - faltam campos obrigat\xF3rios");
      return res.status(400).json({
        success: false,
        error: "Webhook inv\xE1lido - faltam campos obrigat\xF3rios"
      });
    }
    await handleLxpayWebhook(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Webhook] Error processing Lxpay webhook:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var webhook_default = router2;

// server/admin-routes.ts
import express2 from "express";

// server/admin-auth.ts
init_schema();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq as eq2 } from "drizzle-orm";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var TOKEN_EXPIRY = "7d";
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateAdminToken(admin) {
  const payload = {
    id: admin.id,
    username: admin.username
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}
function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
async function authenticateAdmin(username, password) {
  const db = await getDb();
  if (!db) return null;
  const [admin] = await db.select().from(admins).where(eq2(admins.username, username)).limit(1);
  if (!admin) return null;
  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) return null;
  await db.update(admins).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq2(admins.id, admin.id));
  const token = generateAdminToken(admin);
  return { admin, token };
}
async function ensureDefaultAdmin() {
  const db = await getDb();
  if (!db) return;
  const existingAdmins = await db.select().from(admins).limit(1);
  if (existingAdmins.length === 0) {
    const hashedPassword = await hashPassword("admin123");
    await db.insert(admins).values({
      username: "admin",
      password: hashedPassword
    });
    console.log("[Admin] Default admin created: username=admin, password=admin123");
  }
}

// server/admin-routes.ts
var router3 = express2.Router();
ensureDefaultAdmin().catch(console.error);
router3.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const result = await authenticateAdmin(username, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.cookie("admin_token", result.token, {
      httpOnly: true,
      secure: false,
      // Allow in development
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      path: "/"
    });
    res.json({
      success: true,
      admin: {
        id: result.admin.id,
        username: result.admin.username
      }
    });
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router3.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});
router3.get("/me", async (req, res) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const payload = verifyAdminToken(token);
    if (!payload) {
      res.clearCookie("admin_token");
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json({
      id: payload.id,
      username: payload.username
    });
  } catch (error) {
    console.error("[Admin Me] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
function requireAdmin(req, res, next) {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const payload = verifyAdminToken(token);
  if (!payload) {
    res.clearCookie("admin_token");
    return res.status(401).json({ error: "Invalid token" });
  }
  req.admin = payload;
  next();
}
var admin_routes_default = router3;

// server/model-crud-routes.ts
import express3 from "express";
init_schema();
import { eq as eq3 } from "drizzle-orm";
var router4 = express3.Router();
router4.use(requireAdmin);
router4.get("/models", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });
    const allModels = await db.select().from(models).orderBy(models.createdAt);
    res.json(allModels);
  } catch (error) {
    console.error("[Admin Models] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router4.get("/models/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });
    const id = parseInt(req.params.id);
    const [model] = await db.select().from(models).where(eq3(models.id, id)).limit(1);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }
    const products2 = await db.select().from(modelProducts).where(eq3(modelProducts.modelId, id));
    res.json({ ...model, products: products2 });
  } catch (error) {
    console.error("[Admin Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router4.post("/models", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });
    const {
      name,
      slug,
      title,
      subtitle,
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      heroImageUrl,
      aboutImageUrl,
      instagramUrl,
      isActive,
      products: modelProductsData
    } = req.body;
    const [result] = await db.insert(models).values({
      name,
      slug,
      title: title || name,
      subtitle: subtitle || null,
      description: description || null,
      primaryColor: primaryColor || "#FF0066",
      secondaryColor: secondaryColor || "#9333EA",
      accentColor: accentColor || "#FF0066",
      heroImageUrl: heroImageUrl || null,
      aboutImageUrl: aboutImageUrl || null,
      instagramUrl: instagramUrl || null,
      isActive: isActive !== void 0 ? isActive : true
    });
    const modelId = result.insertId;
    if (modelProductsData && Array.isArray(modelProductsData)) {
      for (const product of modelProductsData) {
        await db.insert(modelProducts).values({
          modelId,
          ...product
        });
      }
    }
    res.json({ success: true, id: modelId });
  } catch (error) {
    console.error("[Admin Create Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router4.put("/models/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });
    const id = parseInt(req.params.id);
    const {
      name,
      slug,
      title,
      subtitle,
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      heroImageUrl,
      aboutImageUrl,
      instagramUrl,
      orderBumpId,
      isActive,
      products: modelProductsData
    } = req.body;
    await db.update(models).set({
      name,
      slug,
      title,
      subtitle,
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      heroImageUrl,
      aboutImageUrl,
      instagramUrl,
      isActive,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(models.id, id));
    if (modelProductsData && Array.isArray(modelProductsData)) {
      await db.delete(modelProducts).where(eq3(modelProducts.modelId, id));
      for (const product of modelProductsData) {
        await db.insert(modelProducts).values({
          modelId: id,
          ...product
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("[Admin Update Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router4.delete("/models/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });
    const id = parseInt(req.params.id);
    await db.delete(modelProducts).where(eq3(modelProducts.modelId, id));
    await db.delete(models).where(eq3(models.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[Admin Delete Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
var model_crud_routes_default = router4;

// server/product-crud-routes.ts
import express4 from "express";
init_schema();
import { eq as eq4 } from "drizzle-orm";
var productCrudRouter = express4.Router();
productCrudRouter.use(requireAdmin);
productCrudRouter.get("/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error("[Admin API] Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
productCrudRouter.get("/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const result = await db.select().from(products).where(eq4(products.id, productId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("[Admin API] Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});
productCrudRouter.post("/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const {
      name,
      description,
      priceInCents,
      originalPriceInCents,
      imageUrl,
      accessLink,
      features,
      orderBumpIds,
      isFeatured,
      isActive
    } = req.body;
    if (!name || !description || priceInCents === void 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({ error: "Invalid features format" });
      }
    }
    let parsedOrderBumpIds = orderBumpIds;
    if (typeof orderBumpIds === "string") {
      try {
        parsedOrderBumpIds = JSON.parse(orderBumpIds);
      } catch (e) {
        parsedOrderBumpIds = [];
      }
    }
    await db.insert(products).values({
      name,
      description,
      priceInCents: parseInt(priceInCents),
      originalPriceInCents: originalPriceInCents ? parseInt(originalPriceInCents) : null,
      imageUrl: imageUrl || null,
      accessLink: accessLink || null,
      features: JSON.stringify(parsedFeatures || []),
      orderBumpIds: JSON.stringify(parsedOrderBumpIds || []),
      isFeatured: isFeatured === true || isFeatured === "true",
      isActive: isActive === true || isActive === "true"
    });
    const [created] = await db.select().from(products).where(eq4(products.name, name)).limit(1);
    res.json({ success: true, id: created?.id });
  } catch (error) {
    console.error("[Admin API] Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});
productCrudRouter.put("/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const {
      name,
      description,
      priceInCents,
      originalPriceInCents,
      imageUrl,
      accessLink,
      features,
      orderBumpIds,
      isFeatured,
      isActive
    } = req.body;
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({ error: "Invalid features format" });
      }
    }
    let parsedOrderBumpIds = orderBumpIds;
    if (typeof orderBumpIds === "string") {
      try {
        parsedOrderBumpIds = JSON.parse(orderBumpIds);
      } catch (e) {
        parsedOrderBumpIds = [];
      }
    }
    const updateData = {};
    if (name !== void 0) updateData.name = name;
    if (description !== void 0) updateData.description = description;
    if (priceInCents !== void 0) updateData.priceInCents = parseInt(priceInCents);
    if (originalPriceInCents !== void 0) {
      updateData.originalPriceInCents = originalPriceInCents ? parseInt(originalPriceInCents) : null;
    }
    if (imageUrl !== void 0) updateData.imageUrl = imageUrl || null;
    if (accessLink !== void 0) updateData.accessLink = accessLink || null;
    if (parsedFeatures !== void 0) updateData.features = JSON.stringify(parsedFeatures);
    if (orderBumpIds !== void 0) updateData.orderBumpIds = JSON.stringify(parsedOrderBumpIds || []);
    if (isFeatured !== void 0) updateData.isFeatured = isFeatured === true || isFeatured === "true";
    if (isActive !== void 0) updateData.isActive = isActive === true || isActive === "true";
    await db.update(products).set(updateData).where(eq4(products.id, productId));
    res.json({ success: true });
  } catch (error) {
    console.error("[Admin API] Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});
productCrudRouter.delete("/products/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    await db.delete(products).where(eq4(products.id, productId));
    res.json({ success: true });
  } catch (error) {
    console.error("[Admin API] Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});
var product_crud_routes_default = productCrudRouter;

// server/upload-routes.ts
import express5 from "express";

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/upload-routes.ts
import multer from "multer";
import crypto from "crypto";
var uploadRouter = express5.Router();
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});
uploadRouter.use(requireAdmin);
uploadRouter.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const file = req.file;
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const extension = file.mimetype.split("/")[1];
    const fileName = `${Date.now()}-${randomSuffix}.${extension}`;
    const type = req.body.type || "general";
    const fileKey = `${type}/${fileName}`;
    const { url } = await storagePut(fileKey, file.buffer, file.mimetype);
    res.json({
      success: true,
      url,
      fileKey
    });
  } catch (error) {
    console.error("[Upload] Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
var upload_routes_default = uploadRouter;

// server/orderbump-routes.ts
import express6 from "express";
init_schema();
import { eq as eq5 } from "drizzle-orm";
var router5 = express6.Router();
function verifyAdminAuth(req, res, next) {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const payload = verifyAdminToken(token);
  if (!payload) {
    res.clearCookie("admin_token");
    return res.status(401).json({ error: "Invalid token" });
  }
  next();
}
router5.get("/", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const bumps = await db.select().from(orderBumps).orderBy(orderBumps.displayOrder);
    res.json(bumps);
  } catch (error) {
    console.error("Error fetching order bumps:", error);
    res.status(500).json({ error: "Failed to fetch order bumps" });
  }
});
router5.get("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const bump = await db.select().from(orderBumps).where(eq5(orderBumps.id, parseInt(req.params.id))).limit(1);
    if (bump.length === 0) {
      return res.status(404).json({ error: "Order bump not found" });
    }
    res.json(bump[0]);
  } catch (error) {
    console.error("Error fetching order bump:", error);
    res.status(500).json({ error: "Failed to fetch order bump" });
  }
});
router5.post("/", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const { name, description, priceInCents, originalPriceInCents, imageUrl, accessLink, deliveryDescription, modelId, isActive, displayOrder } = req.body;
    const result = await db.insert(orderBumps).values({
      name,
      description,
      priceInCents,
      originalPriceInCents: originalPriceInCents || null,
      imageUrl: imageUrl || null,
      accessLink: accessLink || null,
      deliveryDescription: deliveryDescription || null,
      modelId: modelId || null,
      isActive: isActive !== void 0 ? isActive : true,
      displayOrder: displayOrder || 0
    });
    res.json({ success: true, id: Number(result[0].insertId) });
  } catch (error) {
    console.error("Error creating order bump:", error);
    res.status(500).json({ error: "Failed to create order bump" });
  }
});
router5.put("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const { name, description, priceInCents, originalPriceInCents, imageUrl, accessLink, deliveryDescription, modelId, isActive, displayOrder } = req.body;
    await db.update(orderBumps).set({
      name,
      description,
      priceInCents,
      originalPriceInCents: originalPriceInCents || null,
      imageUrl: imageUrl || null,
      accessLink: accessLink || null,
      deliveryDescription: deliveryDescription || null,
      modelId: modelId || null,
      isActive,
      displayOrder: displayOrder || 0
    }).where(eq5(orderBumps.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating order bump:", error);
    res.status(500).json({ error: "Failed to update order bump" });
  }
});
router5.delete("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    await db.delete(orderBumps).where(eq5(orderBumps.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting order bump:", error);
    res.status(500).json({ error: "Failed to delete order bump" });
  }
});
var orderbump_routes_default = router5;

// server/model-public-routes.ts
import express7 from "express";
init_schema();
import { eq as eq6, asc } from "drizzle-orm";
var modelPublicRouter = express7.Router();
modelPublicRouter.get("/models/:slug", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const result = await db.select().from(models).where(eq6(models.slug, req.params.slug)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("[API] Error fetching model:", error);
    res.status(500).json({ error: "Failed to fetch model" });
  }
});
modelPublicRouter.get("/models/:slug/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const modelResult = await db.select().from(models).where(eq6(models.slug, req.params.slug)).limit(1);
    if (modelResult.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }
    const model = modelResult[0];
    const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      priceInCents: products.priceInCents,
      originalPriceInCents: products.originalPriceInCents,
      imageUrl: products.imageUrl,
      features: products.features,
      isFeatured: products.isFeatured,
      displayOrder: modelProducts.displayOrder,
      customPrice: modelProducts.customPrice,
      customName: modelProducts.customName,
      customDescription: modelProducts.customDescription
    }).from(modelProducts).innerJoin(products, eq6(modelProducts.productId, products.id)).where(eq6(modelProducts.modelId, model.id)).orderBy(asc(modelProducts.displayOrder));
    const productsWithOverrides = result.map((p) => ({
      id: p.id,
      name: p.customName || p.name,
      description: p.customDescription || p.description,
      priceInCents: p.customPrice || p.priceInCents,
      originalPriceInCents: p.originalPriceInCents,
      imageUrl: p.imageUrl,
      features: p.features,
      isFeatured: p.isFeatured
    }));
    res.json(productsWithOverrides);
  } catch (error) {
    console.error("[API] Error fetching model products:", error);
    res.status(500).json({ error: "Failed to fetch model products" });
  }
});

// server/success-routes.ts
import express8 from "express";
init_schema();
import { eq as eq7, inArray as inArray2, and as and2 } from "drizzle-orm";
var router6 = express8.Router();
router6.get("/:orderNumber", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const orderNumber = req.params.orderNumber;
    const orderResult = await db.select().from(orders).where(eq7(orders.orderNumber, orderNumber)).limit(1);
    if (orderResult.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = orderResult[0];
    const productResult = await db.select().from(products).where(eq7(products.id, order.productId)).limit(1);
    if (productResult.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const product = productResult[0];
    let productAccessLink = null;
    const downloadLinkResult = await db.select().from(downloadLinks).where(
      and2(
        eq7(downloadLinks.orderId, order.id),
        eq7(downloadLinks.productId, order.productId),
        eq7(downloadLinks.isActive, true)
      )
    ).limit(1);
    if (downloadLinkResult.length > 0) {
      const appUrl = process.env.VITE_APP_URL || "https://andreiamolina.com";
      productAccessLink = `${appUrl}/download/${downloadLinkResult[0].token}`;
    }
    let orderBumps_list = [];
    let orderBumpAccessLink = null;
    if (order.orderBumpIds) {
      try {
        const orderBumpIds = JSON.parse(order.orderBumpIds);
        if (Array.isArray(orderBumpIds) && orderBumpIds.length > 0) {
          const orderBumpResult = await db.select().from(orderBumps).where(inArray2(orderBumps.id, orderBumpIds));
          orderBumps_list = orderBumpResult;
          if (orderBumpIds.length > 0) {
            const orderBumpDownloadResult = await db.select().from(downloadLinks).where(
              and2(
                eq7(downloadLinks.orderId, order.id),
                eq7(downloadLinks.productId, orderBumpIds[0]),
                eq7(downloadLinks.isActive, true)
              )
            ).limit(1);
            if (orderBumpDownloadResult.length > 0) {
              const appUrl = process.env.VITE_APP_URL || "https://andreiamolina.com";
              orderBumpAccessLink = `${appUrl}/download/${orderBumpDownloadResult[0].token}`;
            }
          }
        }
      } catch (e) {
        console.error("Erro ao fazer parse de orderBumpIds:", e);
      }
    }
    res.json({
      productName: product.name,
      productAccessLink,
      orderBumpName: orderBumps_list.length > 0 ? orderBumps_list[0].name : null,
      orderBumpAccessLink,
      hasOrderBump: orderBumps_list.length > 0
    });
  } catch (error) {
    console.error("Error fetching success data:", error);
    res.status(500).json({ error: "Failed to fetch success data" });
  }
});
var success_routes_default = router6;

// server/_core/index.ts
import cookieParser from "cookie-parser";
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express9();
  const server = createServer(app);
  app.use(express9.json({ limit: "50mb" }));
  app.use(express9.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use("/api/webhooks", webhook_default);
  app.use("/api/admin", admin_routes_default);
  app.use("/api/admin", model_crud_routes_default);
  app.use("/api/admin", product_crud_routes_default);
  app.use("/api/admin", upload_routes_default);
  app.use("/api/admin/order-bumps", orderbump_routes_default);
  app.use("/api", modelPublicRouter);
  app.use("/api/orders/success", success_routes_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
