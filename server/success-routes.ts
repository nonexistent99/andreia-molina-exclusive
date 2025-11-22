import express from "express";
import { getDb } from "./db";
import { orders, products, orderBumps } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// Get success page data
router.get("/:orderNumber", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const orderNumber = req.params.orderNumber;

    // Buscar pedido
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (orderResult.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult[0];

    // Buscar produto
    const productResult = await db
      .select()
      .from(products)
      .where(eq(products.id, order.productId))
      .limit(1);

    if (productResult.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult[0];

    // Buscar order bump se houver
    let orderBump = null;
    if (order.orderBumpId) {
      const orderBumpResult = await db
        .select()
        .from(orderBumps)
        .where(eq(orderBumps.id, order.orderBumpId))
        .limit(1);

      if (orderBumpResult.length > 0) {
        orderBump = orderBumpResult[0];
      }
    }

    // Retornar dados para a página de sucesso
    res.json({
      productName: product.name,
      productAccessLink: product.accessLink,
      orderBumpName: orderBump?.name || null,
      orderBumpAccessLink: orderBump?.accessLink || null,
      hasOrderBump: !!orderBump,
    });
  } catch (error) {
    console.error("Error fetching success data:", error);
    res.status(500).json({ error: "Failed to fetch success data" });
  }
});

export default router;
