"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import { ReviewSiteSheet } from "./review-site-sheet";
import { deleteReviewSite } from "./actions";

type ReviewSite = {
  id: string;
  name: string;
  url: string;
  weight: number;
  isActive: boolean;
};

export function ReviewSitesClient({ sites }: { sites: ReviewSite[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ReviewSite | undefined>();
  const [deleting, setDeleting] = useState<ReviewSite | undefined>();
  const [isPending, startTransition] = useTransition();

  function openAdd() {
    setEditing(undefined);
    setSheetOpen(true);
  }

  function openEdit(site: ReviewSite) {
    setEditing(site);
    setSheetOpen(true);
  }

  function confirmDelete() {
    if (!deleting) return;
    startTransition(async () => {
      await deleteReviewSite(deleting.id);
      toast.success("Site deleted.");
      setDeleting(undefined);
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Review Sites</h1>
          <p className="mt-1 text-sm text-slate-500">Sites visitors are redirected to after a positive rating.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Site
        </Button>
      </div>

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">No review sites yet.</p>
          <Button className="mt-4" onClick={openAdd}>Add your first site</Button>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 truncate text-sm text-slate-500 hover:text-slate-900 max-w-xs"
                    >
                      <span className="truncate">{site.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>{site.weight}x</TableCell>
                  <TableCell>
                    <Badge variant={site.isActive ? "default" : "secondary"} className={site.isActive ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50" : ""}>
                      {site.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(site)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => setDeleting(site)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ReviewSiteSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        site={editing}
      />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The site will be removed from your review rotation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
