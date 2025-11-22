import express from "express";
import { getDb } from "./db";
import { models, modelProducts } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./admin-routes";

const router = express.Router();

// All routes require admin authentication
router.use(requireAdmin);

/**
 * GET /api/admin/models
 * List all models
 */
router.get("/models", async (req, res) => {
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

/**
 * GET /api/admin/models/:id
 * Get single model by ID
 */
router.get("/models/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });

    const id = parseInt(req.params.id);
    const [model] = await db.select().from(models).where(eq(models.id, id)).limit(1);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Get products for this model
    const products = await db.select().from(modelProducts).where(eq(modelProducts.modelId, id));

    res.json({ ...model, products });
  } catch (error) {
    console.error("[Admin Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/admin/models
 * Create new model
 */
router.post("/models", async (req, res) => {
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
      products: modelProductsData,
    } = req.body;

    // Insert model
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
      isActive: isActive !== undefined ? isActive : true,
    });

    const modelId = result.insertId;

    // Insert products if provided
    if (modelProductsData && Array.isArray(modelProductsData)) {
      for (const product of modelProductsData) {
        await db.insert(modelProducts).values({
          modelId,
          ...product,
        });
      }
    }

    res.json({ success: true, id: modelId });
  } catch (error) {
    console.error("[Admin Create Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/admin/models/:id
 * Update model
 */
router.put("/models/:id", async (req, res) => {
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
      products: modelProductsData,
    } = req.body;

    await db
      .update(models)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(models.id, id));

    // Update products if provided
    if (modelProductsData && Array.isArray(modelProductsData)) {
      // Delete existing products
      await db.delete(modelProducts).where(eq(modelProducts.modelId, id));
      
      // Insert new products
      for (const product of modelProductsData) {
        await db.insert(modelProducts).values({
          modelId: id,
          ...product,
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[Admin Update Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/admin/models/:id
 * Delete model
 */
router.delete("/models/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not available" });

    const id = parseInt(req.params.id);

    // Delete associated products first
    await db.delete(modelProducts).where(eq(modelProducts.modelId, id));

    // Delete model
    await db.delete(models).where(eq(models.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("[Admin Delete Model] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
