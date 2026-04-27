import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmbedTokensClient } from "./embed-tokens-client";

export default async function EmbedPage() {
  const org = await requireOrganization();
  const tokens = await prisma.embedToken.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "desc" },
  });

  return <EmbedTokensClient tokens={tokens} />;
}
