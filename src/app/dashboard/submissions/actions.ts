"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markSubmissionRead(id: string) {
  const org = await requireOrganization();
  await prisma.submission.updateMany({
    where: { id, organizationId: org.id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard");
}
