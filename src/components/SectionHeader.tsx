"use client";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
