"use client";

import { useState } from "react";
import Link from "next/link";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import { caesarDecrypt } from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const ENCRYPTED = "KHOOR";
const SHIFT = 3;
const EXPECTED = caesarDecrypt(ENCRYPTED, SHIFT);

export default function Level1Page() {
  useLevelGuard(1);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCheck = () => {
    const normalized = answer.trim().toUpperCase();
    if (normalized === EXPECTED) {
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
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl tracking-[0.6em] text-accent">
          {ENCRYPTED}
        </div>
        <HintBox hint={`Shift = ${SHIFT}. Output should be uppercase.`} />
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
