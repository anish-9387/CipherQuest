"use client";

type StatPillProps = {
  label: string;
  value: string;
};

export default function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-md border border-border bg-black/40 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p className="mt-2 font-mono text-lg text-foreground">{value}</p>
    </div>
  );
}
