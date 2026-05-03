"use client";

type ProgressBarProps = {
  completedLevels: number[];
  total: number;
  currentLevel?: number;
};

export default function ProgressBar({
  completedLevels,
  total,
  currentLevel,
}: ProgressBarProps) {
  const completedCount = completedLevels.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
        <span>Progress</span>
        <span>
          {completedCount}/{total}
        </span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, index) => {
          const level = index + 1;
          const isCompleted = completedLevels.includes(level);
          const isActive = currentLevel === level && !isCompleted;
          return (
            <div
              key={level}
              className={`h-2 rounded-full border transition ${
                isCompleted
                  ? "border-accent/70 bg-accent"
                  : isActive
                    ? "border-accent/50 bg-accent/40"
                    : "border-border bg-white/5"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
