"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markSubmissionRead } from "./actions";

type Submission = {
  id: string;
  submitterName: string | null;
  rating: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-sm text-amber-500">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function timeAgo(date: Date) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export function SubmissionsList({ submissions }: { submissions: Submission[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleExpand(sub: Submission) {
    setExpanded((prev) => (prev === sub.id ? null : sub.id));
    if (!sub.isRead) {
      startTransition(async () => {
        await markSubmissionRead(sub.id);
      });
    }
  }

  function handleMarkRead(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    startTransition(async () => {
      await markSubmissionRead(id);
      toast.success("Marked as read.");
    });
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-sm text-slate-500">No submissions yet.</p>
        <p className="mt-1 text-xs text-slate-400">
          Feedback submitted through your widget will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          onClick={() => toggleExpand(sub)}
          className={cn(
            "cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm",
            expanded === sub.id && "shadow-sm"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {!sub.isRead && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {sub.submitterName ?? "Anonymous"}
                  </span>
                  <StarRating rating={sub.rating} />
                </div>
                <p className={cn(
                  "mt-0.5 text-sm text-slate-500",
                  expanded !== sub.id && "line-clamp-2"
                )}>
                  {sub.message}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-xs text-slate-400">{timeAgo(sub.createdAt)}</span>
              {!sub.isRead && expanded !== sub.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={isPending}
                  onClick={(e) => handleMarkRead(e, sub.id)}
                >
                  Mark read
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
