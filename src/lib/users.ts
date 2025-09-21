// src/lib/users.ts
import type { User } from "firebase/auth";
import { ensureUserProfile as ensureProfile } from "./db";

// Thin wrapper around db.ts
export async function ensureUserProfile(user: User, nickname: string) {
  await ensureProfile(user.uid, user.email, nickname);
}