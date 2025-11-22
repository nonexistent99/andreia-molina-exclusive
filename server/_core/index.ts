import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import webhookRouter from "../webhook";
import adminRouter from "../admin-routes";
import modelCrudRouter from "../model-crud-routes";
import productCrudRouter from "../product-crud-routes";
import uploadRouter from "../upload-routes";
import orderBumpRouter from "../orderbump-routes";
import { modelPublicRouter } from "../model-public-routes";
import successRouter from "../success-routes";
import cookieParser from "cookie-parser";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Webhook routes (before tRPC to avoid conflicts)
  app.use("/api/webhooks", webhookRouter);
  // Admin authentication routes
  app.use("/api/admin", adminRouter);
  // Admin CRUD routes for models
  app.use("/api/admin", modelCrudRouter);
  // Admin CRUD routes for products
  app.use("/api/admin", productCrudRouter);
  // Admin upload routes
  app.use("/api/admin", uploadRouter);
  // Admin order bump routes
  app.use("/api/admin/order-bumps", orderBumpRouter);
  // Public model routes
  app.use("/api", modelPublicRouter);
  // Success page routes
  app.use("/api/orders/success", successRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
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
