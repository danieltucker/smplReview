"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Copy, Trash2, Plus } from "lucide-react";
import { createEmbedToken, deleteEmbedToken } from "./actions";

type EmbedToken = {
  id: string;
  label: string;
  token: string;
  createdAt: Date;
};

function scriptTag(token: string) {
  return `<script src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"}/widget/router.js" data-token="${token}"></script>`;
}

export function EmbedTokensClient({ tokens }: { tokens: EmbedToken[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<EmbedToken | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createEmbedToken(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Token created.");
        setCreateOpen(false);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      await deleteEmbedToken(deleting.id);
      toast.success("Token deleted.");
      setDeleting(undefined);
    });
  }

  function copyToClipboard(token: string) {
    navigator.clipboard.writeText(scriptTag(token));
    toast.success("Copied to clipboard.");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Embed Code</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paste the script tag into any page to load your review widget.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Token
        </Button>
      </div>

      {tokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">No embed tokens yet.</p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Create your first token
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <Card key={token.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{token.label}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(token.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setDeleting(token)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <code className="flex-1 truncate text-xs text-slate-700">
                    {scriptTag(token.token)}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(token.token)}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Embed Token</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="mt-2 space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" placeholder="e.g. Homepage Widget" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleting?.label}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Any pages using this token will stop loading the widget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
