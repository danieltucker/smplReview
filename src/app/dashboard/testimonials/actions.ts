"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function approveTestimonial(id: string) {
  const org = await requireOrganization();
  await prisma.testimonial.updateMany({
    where: { id, organizationId: org.id },
    data: { status: "PUBLISHED" },
  });
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard");
}

export async function rejectTestimonial(id: string) {
  const org = await requireOrganization();
  await prisma.testimonial.updateMany({
    where: { id, organizationId: org.id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard");
}
