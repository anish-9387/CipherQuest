"use client";

type PuzzleCardProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function PuzzleCard({
  title,
  eyebrow,
  subtitle,
  children,
  className,
}: PuzzleCardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-card p-6 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur ${
        className ?? ""
      }`}
    >
      <header className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-accent/80">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted md:text-base">{subtitle}</p>
        ) : null}
      </header>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}
