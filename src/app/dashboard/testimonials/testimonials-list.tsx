"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveTestimonial, rejectTestimonial } from "./actions";

type Testimonial = {
  id: string;
  submitterName: string;
  body: string;
  rating: number | null;
  status: "PENDING" | "PUBLISHED" | "REJECTED";
  createdAt: Date;
};

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return <span className="text-sm text-amber-500">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-green-50 text-green-700 border-green-200" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

function TestimonialCard({ testimonial, showActions }: { testimonial: Testimonial; showActions: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveTestimonial(testimonial.id);
      toast.success("Testimonial approved.");
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectTestimonial(testimonial.id);
      toast.success("Testimonial rejected.");
    });
  }

  const badge = statusBadge[testimonial.status];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{testimonial.submitterName}</span>
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{testimonial.body}</p>
          <p className="mt-2 text-xs text-slate-400">
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {showActions ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50"
                disabled={isPending}
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={isPending}
                onClick={handleReject}
              >
                Reject
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className={badge.className}>
              {badge.label}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsList({
  pending,
  published,
  rejected,
}: {
  pending: Testimonial[];
  published: Testimonial[];
  rejected: Testimonial[];
}) {
  const groups = [
    { key: "pending", label: "Pending", items: pending, showActions: true },
    { key: "published", label: "Published", items: published, showActions: false },
    { key: "rejected", label: "Rejected", items: rejected, showActions: false },
  ];

  return (
    <div className="space-y-8">
      {groups.map(({ key, label, items, showActions }) => (
        <section key={key}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-base font-medium text-slate-900">{label}</h2>
            <Badge variant="secondary" className="text-xs">{items.length}</Badge>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-slate-400">No {label.toLowerCase()} testimonials.</p>
          ) : (
            <div className="space-y-3">
              {items.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} showActions={showActions} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
