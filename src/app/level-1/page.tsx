"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import { caesarEncrypt } from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const QUESTIONS = [
  { id: "L1-01", plaintext: "HELLO", shift: 3 },
  { id: "L1-02", plaintext: "SECURE", shift: 5 },
  { id: "L1-03", plaintext: "FIREWALL", shift: 7 },
  { id: "L1-04", plaintext: "ENCRYPT", shift: 4 },
  { id: "L1-05", plaintext: "PASSWORD", shift: 6 },
  { id: "L1-06", plaintext: "INTRUDER", shift: 2 },
  { id: "L1-07", plaintext: "CIPHER", shift: 8 },
  { id: "L1-08", plaintext: "ESCAPE", shift: 1 },
  { id: "L1-09", plaintext: "LOCKDOWN", shift: 9 },
  { id: "L1-10", plaintext: "SIGNAL", shift: 3 },
];

function pickRandomQuestion<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

export default function Level1Page() {
  useLevelGuard(1);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const question = useMemo(() => pickRandomQuestion(QUESTIONS), []);
  const encrypted = useMemo(
    () => caesarEncrypt(question.plaintext, question.shift),
    [question]
  );

  const handleCheck = () => {
    const normalized = answer.trim().toUpperCase();
    if (normalized === question.plaintext) {
      completeLevel(1);
      setStatus("success");
      playSuccess();
    } else {
      setStatus("error");
      playError();
    }
  };

  return (
    <LevelShell
      level={1}
      title="Caesar Cipher"
      subtitle="Rotate the alphabet back into place and recover the plaintext."
    >
      <PuzzleCard
        eyebrow="Cipher Input"
        title="Decrypt the Message"
        subtitle="An intercepted payload is locked with a fixed shift. Decode it."
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Question {question.id}
        </p>
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl tracking-[0.6em] text-accent">
          {encrypted}
        </div>
        <HintBox
          hint={`Shift = ${question.shift}. Output should be uppercase.`}
        />
        <InputBox
          label="Plaintext"
          value={answer}
          onChange={setAnswer}
          placeholder="Type the decoded message"
          helper="Letters only, no spaces."
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handleCheck}>
            Check Answer
          </button>
          {status === "success" ? (
            <Link href="/level-2" className="btn-outline">
              Proceed to Level 2
            </Link>
          ) : null}
        </div>
        {status === "success" ? (
          <ResultBox
            status="success"
            message="Cipher cracked. Level 2 unlocked."
          />
        ) : null}
        {status === "error" ? (
          <ResultBox
            status="error"
            message="Access denied. Adjust the shift and try again."
          />
        ) : null}
      </PuzzleCard>
    </LevelShell>
  );
}
