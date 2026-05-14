"use client";

import { useState } from "react";
import { LeadModal } from "@/components/leads/lead-modal";

export function LeadTrigger({
  source,
  courseSlug,
  label,
}: {
  source: "enroll" | "talk_to_expert" | "homepage";
  courseSlug?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-secondary w-full" onClick={() => setOpen(true)}>
        {label}
      </button>
      <LeadModal open={open} onClose={() => setOpen(false)} source={source} courseSlug={courseSlug} />
    </>
  );
}
