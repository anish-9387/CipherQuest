"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/format";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.3em] text-muted">
      <span>Timer</span>
      <span className="font-mono text-foreground">{formatTime(seconds)}</span>
    </div>
  );
}
