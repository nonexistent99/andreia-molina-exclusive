import express from "express";
import { requireAdmin } from "./admin-routes";
import { storagePut } from "./storage";
import multer from "multer";
import crypto from "crypto";

const uploadRouter = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Middleware to protect upload routes
uploadRouter.use(requireAdmin);

// Upload image endpoint
uploadRouter.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const extension = file.mimetype.split("/")[1];
    const fileName = `${Date.now()}-${randomSuffix}.${extension}`;
    
    // Determine folder based on type parameter
    const type = req.body.type || "general";
    const fileKey = `${type}/${fileName}`;

    // Upload to S3
    const { url } = await storagePut(fileKey, file.buffer, file.mimetype);

    res.json({
      success: true,
      url,
      fileKey,
    });
  } catch (error) {
    console.error("[Upload] Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default uploadRouter;
