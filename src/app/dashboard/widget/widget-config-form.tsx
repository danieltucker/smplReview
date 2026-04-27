"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateWidgetConfig } from "./actions";

type WidgetConfig = {
  ratingStyle: "STARS" | "BUTTONS";
  ratingFloor: number;
  hideOnBadPrerating: boolean;
};

export function WidgetConfigForm({ config }: { config: WidgetConfig }) {
  const [ratingStyle, setRatingStyle] = useState(config.ratingStyle);
  const [ratingFloor, setRatingFloor] = useState(String(config.ratingFloor));
  const [hideOnBad, setHideOnBad] = useState(config.hideOnBadPrerating);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const formData = new FormData();
    formData.set("ratingStyle", ratingStyle);
    formData.set("ratingFloor", ratingFloor);
    formData.set("hideOnBadPrerating", String(hideOnBad));

    startTransition(async () => {
      await updateWidgetConfig(formData);
      toast.success("Widget config saved.");
    });
  }

  return (
    <div className="max-w-xl space-y-8">
      <section>
        <Label className="text-base font-medium">Rating Style</Label>
        <p className="mb-4 mt-1 text-sm text-slate-500">
          How should visitors rate their experience?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["STARS", "BUTTONS"] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setRatingStyle(style)}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all",
                ratingStyle === style
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <p className="font-medium text-slate-900">
                {style === "STARS" ? "Stars" : "Good / Bad"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {style === "STARS" ? "★★★★★ rating scale" : "👍 / 👎 buttons"}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <Label htmlFor="ratingFloor" className="text-base font-medium">
          Rating Floor
        </Label>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Send to a review site if rating is at least this value. Below it, show the feedback form instead.
        </p>
        <Select value={ratingFloor} onValueChange={setRatingFloor}>
          <SelectTrigger id="ratingFloor" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ratingStyle === "BUTTONS" ? (
              <SelectItem value="1">Good only</SelectItem>
            ) : (
              <>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </section>

      <section>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <Label htmlFor="hideOnBad" className="text-base font-medium">
              Hide after bad rating
            </Label>
            <p className="mt-0.5 text-sm text-slate-500">
              Widget disappears after the feedback form is submitted.
            </p>
          </div>
          <Switch id="hideOnBad" checked={hideOnBad} onCheckedChange={setHideOnBad} />
        </div>
      </section>

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}
