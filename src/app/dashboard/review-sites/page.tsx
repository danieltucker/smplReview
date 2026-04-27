import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewSitesClient } from "./review-sites-client";

export default async function ReviewSitesPage() {
  const org = await requireOrganization();
  const sites = await prisma.reviewSite.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "asc" },
  });

  return <ReviewSitesClient sites={sites} />;
}
