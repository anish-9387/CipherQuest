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

const PRIVATE_KEY = "delta-7-echo";
const DEFAULT_MESSAGE = "Authorize transfer at node 7.";

export default function Level4Page() {
  useLevelGuard(4);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const signature = useMemo(
    () => signMessage(DEFAULT_MESSAGE, PRIVATE_KEY),
    []
  );
  const publicKey = useMemo(() => derivePublicKey(PRIVATE_KEY), []);

  const handleVerify = () => {
    const isValid = verifySignature(message, signature, PRIVATE_KEY);
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
        <HintBox hint="Try editing the message to see the signature fail." />
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
