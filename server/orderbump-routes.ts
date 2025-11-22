import express from "express";
import { getDb } from "./db";
import { orderBumps } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { verifyAdminToken } from "./admin-auth";

const router = express.Router();

// Middleware to verify admin authentication
function verifyAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
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

// List all order bumps
router.get("/", verifyAdminAuth, async (req, res) => {
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

// Get single order bump
router.get("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const bump = await db.select().from(orderBumps).where(eq(orderBumps.id, parseInt(req.params.id))).limit(1);
    
    if (bump.length === 0) {
      return res.status(404).json({ error: "Order bump not found" });
    }

    res.json(bump[0]);
  } catch (error) {
    console.error("Error fetching order bump:", error);
    res.status(500).json({ error: "Failed to fetch order bump" });
  }
});

// Create order bump
router.post("/", verifyAdminAuth, async (req, res) => {
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
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    res.json({ success: true, id: Number(result[0].insertId) });
  } catch (error) {
    console.error("Error creating order bump:", error);
    res.status(500).json({ error: "Failed to create order bump" });
  }
});

// Update order bump
router.put("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { name, description, priceInCents, originalPriceInCents, imageUrl, accessLink, deliveryDescription, modelId, isActive, displayOrder } = req.body;

    await db.update(orderBumps)
      .set({
        name,
        description,
        priceInCents,
        originalPriceInCents: originalPriceInCents || null,
        imageUrl: imageUrl || null,
        accessLink: accessLink || null,
        deliveryDescription: deliveryDescription || null,
        modelId: modelId || null,
        isActive,
        displayOrder: displayOrder || 0,
      })
      .where(eq(orderBumps.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating order bump:", error);
    res.status(500).json({ error: "Failed to update order bump" });
  }
});

// Delete order bump
router.delete("/:id", verifyAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    await db.delete(orderBumps).where(eq(orderBumps.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting order bump:", error);
    res.status(500).json({ error: "Failed to delete order bump" });
  }
});

export default router;
