import express from "express";
import { authenticateAdmin, verifyAdminToken, ensureDefaultAdmin } from "./admin-auth";

const router = express.Router();

// Ensure default admin exists on startup
ensureDefaultAdmin().catch(console.error);

/**
 * POST /api/admin/login
 * Authenticate admin and return JWT token
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const result = await authenticateAdmin(username, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set HTTP-only cookie with token
    res.cookie("admin_token", result.token, {
      httpOnly: true,
      secure: false, // Allow in development
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      success: true,
      admin: {
        id: result.admin.id,
        username: result.admin.username,
      },
    });
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/admin/logout
 * Clear admin session
 */
router.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

/**
 * GET /api/admin/me
 * Get current admin info from token
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.admin_token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const payload = verifyAdminToken(token);

    if (!payload) {
      res.clearCookie("admin_token");
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({
      id: payload.id,
      username: payload.username,
    });
  } catch (error) {
    console.error("[Admin Me] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Middleware to protect admin routes
 */
export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const payload = verifyAdminToken(token);

  if (!payload) {
    res.clearCookie("admin_token");
    return res.status(401).json({ error: "Invalid token" });
  }

  // Attach admin info to request
  (req as any).admin = payload;
  next();
}

export default router;
