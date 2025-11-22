import express from "express";
import { getDb } from "./db";
import { models, modelProducts, products } from "../drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const modelPublicRouter = express.Router();

// Get model by slug (public route)
modelPublicRouter.get("/models/:slug", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const result = await db
      .select()
      .from(models)
      .where(eq(models.slug, req.params.slug))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("[API] Error fetching model:", error);
    res.status(500).json({ error: "Failed to fetch model" });
  }
});

// Get products by model slug (public route)
modelPublicRouter.get("/models/:slug/products", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // First, get the model
    const modelResult = await db
      .select()
      .from(models)
      .where(eq(models.slug, req.params.slug))
      .limit(1);

    if (modelResult.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    const model = modelResult[0];

    // Get products for this model
    const result = await db
      .select({
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
        customDescription: modelProducts.customDescription,
      })
      .from(modelProducts)
      .innerJoin(products, eq(modelProducts.productId, products.id))
      .where(eq(modelProducts.modelId, model.id))
      .orderBy(asc(modelProducts.displayOrder));

    // Apply custom overrides if they exist
    const productsWithOverrides = result.map(p => ({
      id: p.id,
      name: p.customName || p.name,
      description: p.customDescription || p.description,
      priceInCents: p.customPrice || p.priceInCents,
      originalPriceInCents: p.originalPriceInCents,
      imageUrl: p.imageUrl,
      features: p.features,
      isFeatured: p.isFeatured,
    }));

    res.json(productsWithOverrides);
  } catch (error) {
    console.error("[API] Error fetching model products:", error);
    res.status(500).json({ error: "Failed to fetch model products" });
  }
});
