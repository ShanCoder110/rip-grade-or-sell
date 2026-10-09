import { cookies } from "next/headers";
import {
  DEMO_EMAIL_COOKIE,
  DEMO_ID_COOKIE,
  DEMO_PLAN_COOKIE,
  isDemoAuthEnabled,
} from "@/lib/auth/demo-mode";

export type DemoSession = {
  id: string;
  email: string;
  plan: "free" | "pro";
};

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function readDemoSession(): Promise<DemoSession | null> {
  if (!isDemoAuthEnabled()) return null;
  const jar = await cookies();
  const id = jar.get(DEMO_ID_COOKIE)?.value;
  const email = jar.get(DEMO_EMAIL_COOKIE)?.value;
  if (!id || !email) return null;
  const plan = jar.get(DEMO_PLAN_COOKIE)?.value === "pro" ? "pro" : "free";
  return { id, email, plan };
}

export async function writeDemoSession(session: DemoSession): Promise<void> {
  const jar = await cookies();
  jar.set(DEMO_ID_COOKIE, session.id, cookieOptions);
  jar.set(DEMO_EMAIL_COOKIE, session.email, cookieOptions);
  jar.set(DEMO_PLAN_COOKIE, session.plan, cookieOptions);
}

export async function clearDemoSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(DEMO_ID_COOKIE);
  jar.delete(DEMO_EMAIL_COOKIE);
  jar.delete(DEMO_PLAN_COOKIE);
}
