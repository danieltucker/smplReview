import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const { orgId, orgSlug } = await auth();
  if (!orgId) redirect("/org-setup");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your organization settings.</p>

      <div className="mt-8 max-w-xl space-y-8">
        <section>
          <h2 className="text-base font-medium text-slate-900">Organization</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your organization name, members, and other settings in Clerk.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{orgSlug}</code>
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-slate-900">Team Members</h2>
          <p className="mt-1 text-sm text-slate-500">
            Team member invites are coming in v2.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-red-600">Danger Zone</h2>
          <p className="mt-1 text-sm text-slate-500">
            Organization deletion is managed through your Clerk dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
