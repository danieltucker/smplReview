"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createEmbedToken(formData: FormData) {
  const org = await requireOrganization();
  const label = formData.get("label") as string;
  if (!label) return { error: "Label is required." };

  await prisma.embedToken.create({
    data: { organizationId: org.id, label },
  });

  revalidatePath("/dashboard/embed");
  return {};
}

export async function deleteEmbedToken(id: string) {
  const org = await requireOrganization();
  await prisma.embedToken.deleteMany({ where: { id, organizationId: org.id } });
  revalidatePath("/dashboard/embed");
}
