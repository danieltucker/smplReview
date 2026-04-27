import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionsList } from "./submissions-list";
import { Badge } from "@/components/ui/badge";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const org = await requireOrganization();
  const { filter } = await searchParams;
  const unreadOnly = filter === "unread";

  const submissions = await prisma.submission.findMany({
    where: {
      organizationId: org.id,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = await prisma.submission.count({
    where: { organizationId: org.id, isRead: false },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Submissions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Feedback from visitors who rated below your threshold.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <a
          href="/dashboard/submissions"
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${!unreadOnly ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-500 hover:border-slate-400"}`}
        >
          All
        </a>
        <a
          href="/dashboard/submissions?filter=unread"
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${unreadOnly ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-500 hover:border-slate-400"}`}
        >
          Unread
        </a>
      </div>

      <SubmissionsList submissions={submissions} />
    </div>
  );
}
