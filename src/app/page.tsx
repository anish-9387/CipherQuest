"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import LevelStatusCard from "@/components/LevelStatusCard";
import SectionHeader from "@/components/SectionHeader";
import StatPill from "@/components/StatPill";
import { LEVELS, TOTAL_LEVELS } from "@/lib/levels";
import { useGameStore } from "@/store/useGameStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const completedLevels = useGameStore((state) => state.completedLevels);
  const currentLevel = useGameStore((state) => state.level);
  const reset = useGameStore((state) => state.reset);
  const isEscaped = completedLevels.length >= TOTAL_LEVELS;
  const nextLevel =
    LEVELS.find((level) => !completedLevels.includes(level.id))?.id ??
    LEVELS[TOTAL_LEVELS - 1]?.id ??
    1;
  const progressPercent = Math.round(
    (completedLevels.length / TOTAL_LEVELS) * 100
  );

  return (
    <main className="relative z-10 min-h-screen px-6 py-12 md:px-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="space-y-6"
        >
          <p className="text-xs uppercase tracking-[0.5em] text-accent/80">
            Breach Detected
          </p>
          <h1 className="text-4xl font-semibold text-foreground md:text-6xl">
            Cipher Quest
            <span className="ml-3 text-glow text-accent">Escape Room</span>
          </h1>
          <p className="max-w-xl text-sm text-muted md:text-base">
            You are a cybersecurity analyst trapped inside a compromised system.
            Each layer is locked by cryptography puzzles. Break the ciphers,
            verify the signatures, and escape before the system collapses.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={isEscaped ? "/success" : `/level-${nextLevel}`}
              className="btn-primary"
            >
              {isEscaped ? "View Success" : "Enter Escape Room"}
            </Link>
            <button type="button" className="btn-outline" onClick={reset}>
              Reset Progress
            </button>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          <SectionHeader
            eyebrow="Mission Status"
            title={isEscaped ? "System Stabilized" : "System Compromised"}
            description={`Progress ${progressPercent}% complete. Secure all five layers to escape.`}
          />
          <div className="mt-6">
            <ProgressBar
              completedLevels={completedLevels}
              total={TOTAL_LEVELS}
              currentLevel={currentLevel}
            />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatPill
              label="Nodes Secured"
              value={`${completedLevels.length}/${TOTAL_LEVELS}`}
            />
            <StatPill
              label="Threat Level"
              value={isEscaped ? "LOW" : "SEVERE"}
            />
            <StatPill
              label="Clearance"
              value={isEscaped ? "OVERRIDE" : `LEVEL ${nextLevel}`}
            />
            <StatPill
              label="Signal"
              value={isEscaped ? "STABLE" : "JAMMED"}
            />
          </div>
        </motion.div>
      </section>

      <section className="mt-16 space-y-8">
        <SectionHeader
          eyebrow="Level Map"
          title="Five Layers of Security"
          description="Complete each layer in order. Every success unlocks the next challenge."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {LEVELS.map((level) => {
            const isComplete = completedLevels.includes(level.id);
            const isUnlocked =
              level.id === 1 || completedLevels.includes(level.id - 1);
            const status = isComplete
              ? "complete"
              : isUnlocked
                ? "available"
                : "locked";
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <LevelStatusCard
                  title={level.title}
                  summary={level.summary}
                  route={level.route}
                  status={status}
                  index={level.id}
                />
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}