"use client";

import { useMemo, useState } from "react";
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

const QUESTIONS = [
  { id: "L2-01", coefficient: 3, modulus: 26 },
  { id: "L2-02", coefficient: 5, modulus: 26 },
  { id: "L2-03", coefficient: 7, modulus: 26 },
  { id: "L2-04", coefficient: 9, modulus: 26 },
  { id: "L2-05", coefficient: 11, modulus: 26 },
  { id: "L2-06", coefficient: 15, modulus: 26 },
  { id: "L2-07", coefficient: 17, modulus: 26 },
  { id: "L2-08", coefficient: 19, modulus: 26 },
  { id: "L2-09", coefficient: 21, modulus: 26 },
  { id: "L2-10", coefficient: 23, modulus: 26 },
];

function pickRandomQuestion<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

export default function Level2Page() {
  useLevelGuard(2);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const question = useMemo(() => pickRandomQuestion(QUESTIONS), []);
  const expected = useMemo(
    () => modInverse(question.coefficient, question.modulus) ?? 0,
    [question]
  );

  const handleCheck = () => {
    const numeric = Number(answer);
    if (Number.isFinite(numeric) && numeric === expected) {
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
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Question {question.id}
        </p>
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl text-accent">
          {question.coefficient}x ≡ 1 (mod {question.modulus})
        </div>
        <HintBox
          hint={`Find the inverse of ${question.coefficient} modulo ${question.modulus}.`}
        />
        <InputBox
          label="Value of x"
          value={answer}
          onChange={setAnswer}
          type="number"
          placeholder="Enter a number between 0 and 25"
          helper={`If (${question.coefficient} * x) mod ${question.modulus} = 1, you found it.`}
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
