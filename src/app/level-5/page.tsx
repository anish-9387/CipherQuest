"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import { caesarDecrypt, modInverse, signMessage, verifySignature } from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const CLUE_ENCRYPTED = "NHB LV 15";
const CLUE_SHIFT = 3;
const MOD_COEFFICIENT = 7;
const MODULUS = 26;
const MESSAGE = "ACCESS GRANTED";
const PRIVATE_KEY = "delta-7-echo";

export default function Level5Page() {
  useLevelGuard(5);
  const router = useRouter();
  const completeLevel = useGameStore((state) => state.completeLevel);
  const [clueInput, setClueInput] = useState("");
  const [modInput, setModInput] = useState("");
  const [command, setCommand] = useState(MESSAGE);
  const [sigStatus, setSigStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const expectedClue = useMemo(
    () => caesarDecrypt(CLUE_ENCRYPTED, CLUE_SHIFT),
    []
  );
  const expectedMod = useMemo(
    () => modInverse(MOD_COEFFICIENT, MODULUS) ?? 15,
    []
  );
  const signature = useMemo(() => signMessage(MESSAGE, PRIVATE_KEY), []);

  const clueSolved = clueInput.trim().toUpperCase() === expectedClue;
  const modSolved = Number(modInput) === expectedMod;
  const canEscape = clueSolved && modSolved && sigStatus === "valid";

  const handleVerify = () => {
    const isValid = verifySignature(command, signature, PRIVATE_KEY);
    setSigStatus(isValid ? "valid" : "invalid");
    if (isValid) {
      playSuccess();
    } else {
      playError();
    }
  };

  const handleEscape = () => {
    completeLevel(5);
    playSuccess();
    router.push("/success");
  };

  return (
    <LevelShell
      level={5}
      title="Final Escape"
      subtitle="Combine every discipline. One last lock to open the exit."
    >
      <PuzzleCard
        eyebrow="Step 1"
        title="Decrypt the Clue"
        subtitle="This cipher reveals the key phrase."
      >
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl text-accent">
          {CLUE_ENCRYPTED}
        </div>
        <HintBox hint={`Shift = ${CLUE_SHIFT}.`} />
        <InputBox
          label="Decrypted Clue"
          value={clueInput}
          onChange={setClueInput}
          placeholder="Type the decrypted phrase"
        />
        {clueSolved ? (
          <ResultBox status="success" message="Clue verified." />
        ) : null}
      </PuzzleCard>

      <PuzzleCard
        eyebrow="Step 2"
        title="Solve the Modular Gate"
        subtitle="Find the inverse to power the exit key."
      >
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl text-accent">
          {MOD_COEFFICIENT}x ≡ 1 (mod {MODULUS})
        </div>
        <InputBox
          label="x Value"
          value={modInput}
          onChange={setModInput}
          type="number"
          placeholder="Enter x"
        />
        {modSolved ? (
          <ResultBox status="success" message="Gate aligned." />
        ) : null}
      </PuzzleCard>

      <PuzzleCard
        eyebrow="Step 3"
        title="Verify the Command"
        subtitle="Confirm the final authorization message."
      >
        <InputBox
          label="Command Message"
          value={command}
          onChange={setCommand}
          placeholder="Enter the authorization text"
        />
        <div className="rounded-md border border-border bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Signature</p>
          <p className="mt-2 break-all font-mono text-sm text-accent">
            {signature}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handleVerify}>
            Verify Signature
          </button>
        </div>
        {sigStatus === "valid" ? (
          <ResultBox status="success" message="Signature accepted." />
        ) : null}
        {sigStatus === "invalid" ? (
          <ResultBox
            status="error"
            message="Signature mismatch. Authorization rejected."
          />
        ) : null}
      </PuzzleCard>

      <PuzzleCard
        eyebrow="Escape"
        title="Unlock the Door"
        subtitle="All checks must pass to release the exit mechanism."
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleEscape}
            disabled={!canEscape}
          >
            Unlock Door
          </button>
          {!canEscape ? (
            <span className="text-sm text-muted">
              Complete all steps to escape.
            </span>
          ) : null}
        </div>
        {canEscape ? (
          <ResultBox status="success" message="Exit protocol ready." />
        ) : null}
      </PuzzleCard>
    </LevelShell>
  );
}
