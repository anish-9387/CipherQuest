"use client";

import { useState } from "react";
import Link from "next/link";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import { modInverse } from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const MOD = 26;
const COEFFICIENT = 7;
const EXPECTED = modInverse(COEFFICIENT, MOD) ?? 15;

export default function Level2Page() {
  useLevelGuard(2);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCheck = () => {
    const numeric = Number(answer);
    if (Number.isFinite(numeric) && numeric === EXPECTED) {
      completeLevel(2);
      setStatus("success");
      playSuccess();
    } else {
      setStatus("error");
      playError();
    }
  };

  return (
    <LevelShell
      level={2}
      title="Modular Arithmetic"
      subtitle="Solve the inverse to unlock the next circuit."
    >
      <PuzzleCard
        eyebrow="Equation"
        title="Find x"
        subtitle="Compute the modular inverse for the key schedule."
      >
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl text-accent">
          {COEFFICIENT}x ≡ 1 (mod {MOD})
        </div>
        <HintBox hint="You need the modular inverse of 7 under mod 26." />
        <InputBox
          label="Value of x"
          value={answer}
          onChange={setAnswer}
          type="number"
          placeholder="Enter a number between 0 and 25"
          helper="If (7 * x) mod 26 = 1, you found it."
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handleCheck}>
            Validate Answer
          </button>
          {status === "success" ? (
            <Link href="/level-3" className="btn-outline">
              Proceed to Level 3
            </Link>
          ) : null}
        </div>
        {status === "success" ? (
          <ResultBox
            status="success"
            message="Inverse confirmed. Level 3 unlocked."
          />
        ) : null}
        {status === "error" ? (
          <ResultBox
            status="error"
            message="Incorrect inverse. Recalculate and retry."
          />
        ) : null}
      </PuzzleCard>
    </LevelShell>
  );
}
