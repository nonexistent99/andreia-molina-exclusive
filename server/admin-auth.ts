import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { admins, type Admin } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "7d"; // 7 days

export interface AdminTokenPayload {
  id: number;
  username: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for admin
 */
export function generateAdminToken(admin: Admin): string {
  const payload: AdminTokenPayload = {
    id: admin.id,
    username: admin.username,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode admin JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Authenticate admin with username and password
 */
export async function authenticateAdmin(username: string, password: string): Promise<{ admin: Admin; token: string } | null> {
  const db = await getDb();
  if (!db) return null;

  const [admin] = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  
  if (!admin) return null;

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) return null;

  // Update last login
  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, admin.id));

  const token = generateAdminToken(admin);
  return { admin, token };
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: number): Promise<Admin | null> {
  const db = await getDb();
  if (!db) return null;

  const [admin] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return admin || null;
}

/**
 * Create default admin if none exists
 */
export async function ensureDefaultAdmin(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existingAdmins = await db.select().from(admins).limit(1);
  
  if (existingAdmins.length === 0) {
    const hashedPassword = await hashPassword("admin123");
    await db.insert(admins).values({
      username: "admin",
      password: hashedPassword,
    });
    console.log("[Admin] Default admin created: username=admin, password=admin123");
  }
}
