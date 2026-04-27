"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { createReviewSite, updateReviewSite } from "./actions";

type ReviewSite = {
  id: string;
  name: string;
  url: string;
  weight: number;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  site?: ReviewSite;
};

export function ReviewSiteSheet({ open, onClose, site }: Props) {
  const [isActive, setIsActive] = useState(site?.isActive ?? true);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    formData.set("isActive", String(isActive));
    startTransition(async () => {
      const result = site
        ? await updateReviewSite(site.id, formData)
        : await createReviewSite(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(site ? "Site updated." : "Site added.");
        onClose();
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{site ? "Edit Review Site" : "Add Review Site"}</SheetTitle>
        </SheetHeader>

        <form ref={formRef} action={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={site?.name} placeholder="Google Business" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url">Review URL</Label>
            <div className="flex gap-2">
              <Input id="url" name="url" type="url" defaultValue={site?.url} placeholder="https://..." required className="flex-1" />
              {site?.url && (
                <Button type="button" variant="outline" size="sm" onClick={() => window.open(site.url, "_blank")}>
                  Test
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" name="weight" type="number" min={1} max={10} defaultValue={site?.weight ?? 1} />
            <p className="text-xs text-slate-500">Higher weight = more likely to be selected.</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
