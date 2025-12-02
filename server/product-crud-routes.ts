import express from "express";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./admin-routes";

const productCrudRouter = express.Router();

// Middleware to verify admin authentication
productCrudRouter.use(requireAdmin);

// Get all products
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

// Get single product by ID
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

    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("[Admin API] Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create new product
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
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !description || priceInCents === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({ error: "Invalid features format" });
      }
    }

    // Parse orderBumpIds if it's a string
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
      isActive: isActive === true || isActive === "true",
    });

    // Get the created product
    const [created] = await db.select().from(products).where(eq(products.name, name)).limit(1);

    res.json({ success: true, id: created?.id });
  } catch (error) {
    console.error("[Admin API] Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
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
      isActive,
    } = req.body;

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({ error: "Invalid features format" });
      }
    }

    // Parse orderBumpIds if it's a string
    let parsedOrderBumpIds = orderBumpIds;
    if (typeof orderBumpIds === "string") {
      try {
        parsedOrderBumpIds = JSON.parse(orderBumpIds);
      } catch (e) {
        parsedOrderBumpIds = [];
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (priceInCents !== undefined) updateData.priceInCents = parseInt(priceInCents);
    if (originalPriceInCents !== undefined) {
      updateData.originalPriceInCents = originalPriceInCents ? parseInt(originalPriceInCents) : null;
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (accessLink !== undefined) updateData.accessLink = accessLink || null;
    if (parsedFeatures !== undefined) updateData.features = JSON.stringify(parsedFeatures);
    if (orderBumpIds !== undefined) updateData.orderBumpIds = JSON.stringify(parsedOrderBumpIds || []);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === "true";
    if (isActive !== undefined) updateData.isActive = isActive === true || isActive === "true";

    await db.update(products).set(updateData).where(eq(products.id, productId));

    res.json({ success: true });
  } catch (error) {
    console.error("[Admin API] Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
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

    await db.delete(products).where(eq(products.id, productId));

    res.json({ success: true });
  } catch (error) {
    console.error("[Admin API] Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default productCrudRouter;
