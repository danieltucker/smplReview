import Link from "next/link";
import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const org = await requireOrganization();

  const [reviewSiteCount, unreadCount, pendingTestimonialCount, tokenCount] =
    await Promise.all([
      prisma.reviewSite.count({ where: { organizationId: org.id, isActive: true } }),
      prisma.submission.count({ where: { organizationId: org.id, isRead: false } }),
      prisma.testimonial.count({ where: { organizationId: org.id, status: "PENDING" } }),
      prisma.embedToken.count({ where: { organizationId: org.id } }),
    ]);

  const [recentSubmissions, pendingTestimonials] = await Promise.all([
    prisma.submission.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.testimonial.findMany({
      where: { organizationId: org.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Active Review Sites", value: reviewSiteCount, href: "/dashboard/review-sites", badge: null },
    { label: "Submissions", value: unreadCount, href: "/dashboard/submissions", badge: unreadCount > 0 ? `${unreadCount} unread` : null },
    { label: "Testimonials", value: pendingTestimonialCount, href: "/dashboard/testimonials", badge: pendingTestimonialCount > 0 ? `${pendingTestimonialCount} pending` : null },
    { label: "Embed Tokens", value: tokenCount, href: "/dashboard/embed", badge: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">{org.name}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  {stat.badge && (
                    <Badge variant="secondary" className="mb-1 bg-amber-50 text-amber-700">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Submissions</CardTitle>
            <Link href="/dashboard/submissions" className="text-sm text-slate-500 hover:text-slate-900">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-slate-400">No submissions yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentSubmissions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {!s.isRead && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      <span className="text-sm text-slate-700 line-clamp-1">
                        {s.submitterName ?? "Anonymous"}: {s.message}
                      </span>
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-slate-400">★{s.rating}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Testimonials</CardTitle>
            <Link href="/dashboard/testimonials" className="text-sm text-slate-500 hover:text-slate-900">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {pendingTestimonials.length === 0 ? (
              <p className="text-sm text-slate-400">No pending testimonials.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pendingTestimonials.map((t) => (
                  <li key={t.id} className="py-2">
                    <p className="text-sm font-medium text-slate-700">{t.submitterName}</p>
                    <p className="text-sm text-slate-500 line-clamp-1">{t.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
