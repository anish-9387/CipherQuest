"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import { derivePublicKey, signMessage, verifySignature } from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const QUESTIONS = [
  {
    id: "L4-01",
    message: "Authorize transfer at node 7.",
    privateKey: "delta-7-echo",
    hint: "Check for any altered characters.",
  },
  {
    id: "L4-02",
    message: "Bypass gate three with clearance alpha.",
    privateKey: "alpha-clearance",
    hint: "The signature only matches the original payload.",
  },
  {
    id: "L4-03",
    message: "Deploy firewall patch 12B immediately.",
    privateKey: "patch-12b-key",
    hint: "Try inserting a space to break it.",
  },
  {
    id: "L4-04",
    message: "Rotate access codes at 19:00 UTC.",
    privateKey: "rotate-utc-19",
    hint: "Time stamps must be exact.",
  },
  {
    id: "L4-05",
    message: "Sync backup shards to vault 5.",
    privateKey: "vault-five-sync",
    hint: "Even a single character change fails.",
  },
  {
    id: "L4-06",
    message: "Restart proxy nodes on signal green.",
    privateKey: "proxy-green",
    hint: "Keep the message untouched.",
  },
  {
    id: "L4-07",
    message: "Disable rogue process 09X.",
    privateKey: "rogue-09x",
    hint: "Signatures bind the exact string.",
  },
  {
    id: "L4-08",
    message: "Engage isolation protocol Kappa.",
    privateKey: "kappa-isolate",
    hint: "Case sensitivity matters.",
  },
  {
    id: "L4-09",
    message: "Route telemetry through node A3.",
    privateKey: "telemetry-a3",
    hint: "Any edit invalidates the signature.",
  },
  {
    id: "L4-10",
    message: "Confirm endpoint seal is intact.",
    privateKey: "seal-intact",
    hint: "Do not add extra punctuation.",
  },
];

function pickRandomQuestion<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

export default function Level4Page() {
  useLevelGuard(4);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const question = useMemo(() => pickRandomQuestion(QUESTIONS), []);
  const [message, setMessage] = useState(question.message);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const signature = useMemo(
    () => signMessage(question.message, question.privateKey),
    [question]
  );
  const publicKey = useMemo(
    () => derivePublicKey(question.privateKey),
    [question]
  );

  const handleVerify = () => {
    const isValid = verifySignature(message, signature, question.privateKey);
    if (isValid) {
      completeLevel(4);
      setStatus("valid");
      playSuccess();
    } else {
      setStatus("invalid");
      playError();
    }
  };

  return (
    <LevelShell
      level={4}
      title="Digital Signature"
      subtitle="Validate the message integrity before the system trusts it."
    >
      <PuzzleCard
        eyebrow="Signature Check"
        title="Verify Authenticity"
        subtitle="If the message was tampered with, the signature will fail."
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Question {question.id}
        </p>
        <InputBox
          label="Message Payload"
          value={message}
          onChange={setMessage}
          placeholder="Enter message"
        />
        <div className="rounded-md border border-border bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Signature
          </p>
          <p className="mt-2 break-all font-mono text-sm text-accent">
            {signature}
          </p>
        </div>
        <div className="rounded-md border border-border bg-black/50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Public Key
          </p>
          <p className="mt-2 font-mono text-sm text-accent-2">{publicKey}</p>
        </div>
        <HintBox hint={question.hint} />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handleVerify}>
            Verify Signature
          </button>
          {status === "valid" ? (
            <Link href="/level-5" className="btn-outline">
              Proceed to Final Escape
            </Link>
          ) : null}
        </div>
        {status === "valid" ? (
          <ResultBox
            status="success"
            message="Signature valid. Level 5 unlocked."
          />
        ) : null}
        {status === "invalid" ? (
          <ResultBox
            status="error"
            message="Signature mismatch. Message tampering detected."
          />
        ) : null}
      </PuzzleCard>
    </LevelShell>
  );
}
