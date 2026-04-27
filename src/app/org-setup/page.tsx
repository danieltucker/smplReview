import { OrganizationList } from "@clerk/nextjs";

export default function OrgSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">
          Select or create an organization
        </h1>
        <OrganizationList
          hidePersonal
          afterSelectOrganizationUrl="/dashboard"
          afterCreateOrganizationUrl="/dashboard"
        />
      </div>
    </div>
  );
}
