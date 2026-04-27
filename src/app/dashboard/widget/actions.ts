"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RatingStyle } from "@prisma/client";

export async function updateWidgetConfig(formData: FormData) {
  const org = await requireOrganization();
  const ratingStyle = formData.get("ratingStyle") as RatingStyle;
  const ratingFloor = parseInt(formData.get("ratingFloor") as string);
  const hideOnBadPrerating = formData.get("hideOnBadPrerating") === "true";

  await prisma.widgetConfig.upsert({
    where: { organizationId: org.id },
    update: { ratingStyle, ratingFloor, hideOnBadPrerating },
    create: { organizationId: org.id, ratingStyle, ratingFloor, hideOnBadPrerating },
  });

  revalidatePath("/dashboard/widget");
  return {};
}
