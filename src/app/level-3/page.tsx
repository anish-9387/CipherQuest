"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import HintBox from "@/components/HintBox";
import ResultBox from "@/components/ResultBox";
import { bruteForceAttempts } from "@/lib/puzzles";
import { playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const QUESTIONS = [
  { id: "L3-01", password: "0042", hint: "Starts with 00." },
  { id: "L3-02", password: "1234", hint: "Classic weak pin." },
  { id: "L3-03", password: "1337", hint: "Leet culture." },
  { id: "L3-04", password: "2024", hint: "A recent year." },
  { id: "L3-05", password: "3141", hint: "Pi sequence." },
  { id: "L3-06", password: "4444", hint: "All digits match." },
  { id: "L3-07", password: "9001", hint: "Power level." },
  { id: "L3-08", password: "2718", hint: "Euler's constant." },
  { id: "L3-09", password: "7777", hint: "Lucky digits." },
  { id: "L3-10", password: "0007", hint: "License to crack." },
];

function pickRandomQuestion<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

const STEP = 73;
const INTERVAL_MS = 35;

export default function Level3Page() {
  useLevelGuard(3);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const question = useMemo(() => pickRandomQuestion(QUESTIONS), []);
  const targetAttempts = useMemo(
    () => bruteForceAttempts(question.password) ?? 0,
    [question]
  );
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = window.setInterval(() => {
      setAttempts((value) => {
        const next = Math.min(value + STEP, targetAttempts);
        if (next >= targetAttempts) {
          setStatus("done");
          completeLevel(3);
          playSuccess();
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [completeLevel, status, targetAttempts]);

  const progress = targetAttempts
    ? Math.min(attempts / targetAttempts, 1) * 100
    : 0;

  const handleStart = () => {
    setAttempts(0);
    setStatus("running");
  };

  return (
    <LevelShell
      level={3}
      title="Password Cracking"
      subtitle="Simulate a brute-force attack and expose the weak password."
    >
      <PuzzleCard
        eyebrow="Brute Force"
        title="Crack the 4-Digit Password"
        subtitle="Watch the attack run until the correct passcode is found."
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Question {question.id}
        </p>
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl tracking-[0.4em] text-accent">
          {status === "done" ? question.password : "----"}
        </div>
        <HintBox
          hint={`Weak passwords fall fast. ${question.hint}`}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
            <span>Attempts</span>
            <span className="font-mono text-foreground">{attempts}</span>
          </div>
          <div className="h-2 rounded-full border border-border bg-white/5">
            <div
              className="h-full rounded-full bg-accent transition"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {status === "idle" ? (
            <button type="button" className="btn-primary" onClick={handleStart}>
              Start Crack
            </button>
          ) : null}
          {status === "running" ? (
            <button type="button" className="btn-outline" disabled>
              Cracking...
            </button>
          ) : null}
          {status === "done" ? (
            <Link href="/level-4" className="btn-outline">
              Proceed to Level 4
            </Link>
          ) : null}
        </div>
        {status === "done" ? (
          <ResultBox
            status="success"
            message="Password recovered. Level 4 unlocked."
          />
        ) : null}
      </PuzzleCard>
    </LevelShell>
  );
}
