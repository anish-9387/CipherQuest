"use client";

import Link from "next/link";

type LevelStatusCardProps = {
  title: string;
  summary: string;
  route: string;
  status: "locked" | "available" | "complete";
  index: number;
};

const statusStyles = {
  locked: "border-border/60 text-muted",
  available: "border-accent/50 text-accent",
  complete: "border-accent-2/60 text-accent-2",
};

export default function LevelStatusCard({
  title,
  summary,
  route,
  status,
  index,
}: LevelStatusCardProps) {
  const isLocked = status === "locked";

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border bg-black/50 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)] ${
        statusStyles[status]
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em]">Level {index}</span>
        <span className="text-xs uppercase tracking-[0.3em]">
          {status === "locked"
            ? "Locked"
            : status === "complete"
              ? "Complete"
              : "Unlocked"}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted">{summary}</p>
      {isLocked ? (
        <button type="button" className="btn-outline" disabled>
          Clearance Required
        </button>
      ) : (
        <Link href={route} className="btn-primary">
          {status === "complete" ? "Replay Level" : "Enter Level"}
        </Link>
      )}
    </div>
  );
}
