import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) throw new Error("CLERK_WEBHOOK_SECRET is not set");

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = JSON.stringify(await req.json());
  const wh = new Webhook(secret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  switch (evt.type) {
    case "organization.created": {
      await prisma.organization.create({
        data: {
          clerkOrgId: evt.data.id,
          name: evt.data.name,
          // Provision default widget config at org creation time
          widgetConfig: { create: {} },
        },
      });
      break;
    }

    case "organization.updated": {
      await prisma.organization.update({
        where: { clerkOrgId: evt.data.id },
        data: { name: evt.data.name },
      });
      break;
    }

    case "organization.deleted": {
      if (evt.data.id) {
        // deleteMany avoids a throw if the org was never synced
        await prisma.organization.deleteMany({
          where: { clerkOrgId: evt.data.id },
        });
      }
      break;
    }

    case "organizationMembership.created": {
      const org = await prisma.organization.findUnique({
        where: { clerkOrgId: evt.data.organization.id },
      });
      if (org) {
        await prisma.user.upsert({
          where: { clerkUserId: evt.data.public_user_data.user_id },
          create: {
            clerkUserId: evt.data.public_user_data.user_id,
            organizationId: org.id,
            role: evt.data.role,
          },
          update: {
            organizationId: org.id,
            role: evt.data.role,
          },
        });
      }
      break;
    }

    case "organizationMembership.deleted": {
      await prisma.user.deleteMany({
        where: { clerkUserId: evt.data.public_user_data.user_id },
      });
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
