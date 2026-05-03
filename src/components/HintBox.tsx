"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type HintBoxProps = {
  hint: string;
};

export default function HintBox({ hint }: HintBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="btn-outline"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide Hint" : "Show Hint"}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-md border border-border bg-black/50 p-4 text-sm text-muted"
          >
            <p className="font-mono">{hint}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
