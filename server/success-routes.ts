import express from "express";
import { getDb } from "./db";
import { orders, products, orderBumps, downloadLinks } from "../drizzle/schema";
import { eq, inArray, and } from "drizzle-orm";

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

    // Buscar link de download do produto principal
    let productAccessLink = null;
    const downloadLinkResult = await db
      .select()
      .from(downloadLinks)
      .where(
        and(
          eq(downloadLinks.orderId, order.id),
          eq(downloadLinks.productId, order.productId),
          eq(downloadLinks.isActive, true)
        )
      )
      .limit(1);

    if (downloadLinkResult.length > 0) {
      const appUrl = process.env.VITE_APP_URL || 'https://andreiamolina.com';
      productAccessLink = `${appUrl}/download/${downloadLinkResult[0].token}`;
    }

    // Buscar order bumps se houver (orderBumpIds é um JSON array)
    let orderBumps_list = [];
    let orderBumpAccessLink = null;
    if (order.orderBumpIds) {
      try {
        const orderBumpIds = JSON.parse(order.orderBumpIds);
        if (Array.isArray(orderBumpIds) && orderBumpIds.length > 0) {
          const orderBumpResult = await db
            .select()
            .from(orderBumps)
            .where(inArray(orderBumps.id, orderBumpIds));
          orderBumps_list = orderBumpResult;

          // Buscar link de download do primeiro order bump
          if (orderBumpIds.length > 0) {
            const orderBumpDownloadResult = await db
              .select()
              .from(downloadLinks)
              .where(
                and(
                  eq(downloadLinks.orderId, order.id),
                  eq(downloadLinks.productId, orderBumpIds[0]),
                  eq(downloadLinks.isActive, true)
                )
              )
              .limit(1);

            if (orderBumpDownloadResult.length > 0) {
              const appUrl = process.env.VITE_APP_URL || 'https://andreiamolina.com';
              orderBumpAccessLink = `${appUrl}/download/${orderBumpDownloadResult[0].token}`;
            }
          }
        }
      } catch (e) {
        console.error('Erro ao fazer parse de orderBumpIds:', e);
      }
    }

    // Retornar dados para a página de sucesso
    res.json({
      productName: product.name,
      productAccessLink: productAccessLink,
      orderBumpName: orderBumps_list.length > 0 ? orderBumps_list[0].name : null,
      orderBumpAccessLink: orderBumpAccessLink,
      hasOrderBump: orderBumps_list.length > 0,
    });
  } catch (error) {
    console.error("Error fetching success data:", error);
    res.status(500).json({ error: "Failed to fetch success data" });
  }
});

export default router;
