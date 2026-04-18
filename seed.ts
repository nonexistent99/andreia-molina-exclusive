import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema";
import * as dotenv from "dotenv";
dotenv.config();

async function run() {
  console.log("Connecting to DB:", process.env.DATABASE_URL);
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL as string);
    const db = drizzle(connection, { schema });
    
    const prods = await db.select().from(schema.products);
    console.log("Products in DB:", prods.length);
    
    if (prods.length === 0) {
      console.log("Inserting dummy pack and order bump...");
      
      const insertResult = await db.insert(schema.products).values({
        name: "Pack Vanessa",
        description: "Conteúdo vazado exclusivo",
        priceInCents: 1499,
        isActive: true,
        isFeatured: true,
      });
      const mainId = (insertResult[0] as any).insertId;
      console.log("Created main product, ID:", mainId);

      const bumpResult = await db.insert(schema.products).values({
        name: "Autorizacao Dispositivo",
        description: "Taxa de autorização obrigatória",
        priceInCents: 890,
        isActive: true,
        isFeatured: false,
      });
      const bumpId = (bumpResult[0] as any).insertId;
      console.log("Created bump product, ID:", bumpId);

      // Add actual Order Bump link table
      await db.insert(schema.orderBumps).values({
        name: "Autorizacao Dispositivo",
        description: "Taxa de segurança para o dispositivo",
        priceInCents: 890,
        slug: "autorizacao",
        isActive: true,
        productId: bumpId,
      });

      console.log("Seed complete.");
    }
    
    connection.end();
  } catch (e) {
    console.error("Seed error:", e);
  }
}

run();
