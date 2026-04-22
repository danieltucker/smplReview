import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrganization() {
  const { orgId } = await auth();
  if (!orgId) return null;
  return prisma.organization.findUnique({ where: { clerkOrgId: orgId } });
}

// Use in server components/actions that require an active org context.
// Throws if no org is found — caller should handle the redirect.
export async function requireOrganization() {
  const org = await getOrganization();
  if (!org) throw new Error("No organization found for authenticated user");
  return org;
}
