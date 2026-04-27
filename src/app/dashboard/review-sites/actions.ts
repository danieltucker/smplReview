"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { error?: string };

export async function createReviewSite(formData: FormData): Promise<ActionResult> {
  const org = await requireOrganization();
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const weight = parseInt(formData.get("weight") as string) || 1;

  if (!name || !url) return { error: "Name and URL are required." };

  await prisma.reviewSite.create({
    data: { organizationId: org.id, name, url, weight, isActive: true },
  });

  revalidatePath("/dashboard/review-sites");
  return {};
}

export async function updateReviewSite(id: string, formData: FormData): Promise<ActionResult> {
  const org = await requireOrganization();
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const weight = parseInt(formData.get("weight") as string) || 1;
  const isActive = formData.get("isActive") === "true";

  await prisma.reviewSite.updateMany({
    where: { id, organizationId: org.id },
    data: { name, url, weight, isActive },
  });

  revalidatePath("/dashboard/review-sites");
  return {};
}

export async function deleteReviewSite(id: string) {
  const org = await requireOrganization();
  await prisma.reviewSite.deleteMany({ where: { id, organizationId: org.id } });
  revalidatePath("/dashboard/review-sites");
}
