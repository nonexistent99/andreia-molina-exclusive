import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = process.env.NODE_ENV === "production"
    ? "/workspace/dist/public"
    : path.resolve(import.meta.dirname, "../..", "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    
    // Substituir variáveis de ambiente
    html = html.replace(/%VITE_APP_LOGO%/g, process.env.VITE_APP_LOGO || "");
    html = html.replace(/%VITE_APP_TITLE%/g, process.env.VITE_APP_TITLE || "");
    
    res.set("Content-Type", "text/html").send(html);
  });
}

