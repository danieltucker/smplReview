import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <span className="text-lg font-semibold text-slate-900">smplReview</span>
      </div>

      <div className="border-b border-slate-200 px-4 py-3">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger:
                "w-full justify-between rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50",
            },
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="text-sm text-slate-600">Account</span>
        </div>
      </div>
    </aside>
  );
}
