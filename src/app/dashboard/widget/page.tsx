import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WidgetConfigForm } from "./widget-config-form";

export default async function WidgetConfigPage() {
  const org = await requireOrganization();
  const config = await prisma.widgetConfig.findUnique({
    where: { organizationId: org.id },
  });

  const defaults = config ?? {
    ratingStyle: "BUTTONS" as const,
    ratingFloor: 4,
    hideOnBadPrerating: true,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Widget Config</h1>
      <p className="mb-8 mt-1 text-sm text-slate-500">
        Control how your review router widget behaves.
      </p>
      <WidgetConfigForm config={defaults} />
    </div>
  );
}
