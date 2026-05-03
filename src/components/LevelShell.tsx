"use client";

import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";

type LevelShellProps = {
  level: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function LevelShell({
  level,
  title,
  subtitle,
  children,
}: LevelShellProps) {
  const completedLevels = useGameStore((state) => state.completedLevels);

  return (
    <main className="relative z-10 min-h-screen px-6 py-10 md:px-12">
      <header className="mb-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="btn-outline">
            Back to Hub
          </Link>
          <Timer />
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
            Level {level}
          </p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-sm text-muted md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <ProgressBar
          completedLevels={completedLevels}
          total={5}
          currentLevel={level}
        />
      </header>
      <div className="space-y-8">{children}</div>
    </main>
  );
}
