"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LevelShell from "@/components/LevelShell";
import PuzzleCard from "@/components/PuzzleCard";
import InputBox from "@/components/InputBox";
import ResultBox from "@/components/ResultBox";
import HintBox from "@/components/HintBox";
import {
  caesarEncrypt,
  modInverse,
  signMessage,
  verifySignature,
} from "@/lib/puzzles";
import { playError, playSuccess } from "@/lib/sound";
import { useLevelGuard } from "@/lib/useLevelGuard";
import { useGameStore } from "@/store/useGameStore";

const QUESTIONS = [
  {
    id: "L5-01",
    cluePlaintext: "KEYISFIFTEEN",
    clueShift: 3,
    modCoefficient: 7,
    modulus: 26,
    message: "ACCESS GRANTED",
    privateKey: "delta-7-echo",
  },
  {
    id: "L5-02",
    cluePlaintext: "EXITISOPEN",
    clueShift: 5,
    modCoefficient: 5,
    modulus: 26,
    message: "OVERRIDE NODE 2",
    privateKey: "override-node-2",
  },
  {
    id: "L5-03",
    cluePlaintext: "LOCKDISABLED",
    clueShift: 4,
    modCoefficient: 11,
    modulus: 26,
    message: "CLEARANCE ACCEPTED",
    privateKey: "clearance-accepted",
  },
  {
    id: "L5-04",
    cluePlaintext: "SYSTEMSTABLE",
    clueShift: 2,
    modCoefficient: 9,
    modulus: 26,
    message: "SHUTDOWN THREAT",
    privateKey: "shutdown-threat",
  },
  {
    id: "L5-05",
    cluePlaintext: "PORTALUNLOCK",
    clueShift: 7,
    modCoefficient: 15,
    modulus: 26,
    message: "CONFIRM AUTH ROUTE",
    privateKey: "auth-route",
  },
  {
    id: "L5-06",
    cluePlaintext: "GATEISOPEN",
    clueShift: 1,
    modCoefficient: 17,
    modulus: 26,
    message: "ENABLE EXIT PROTOCOL",
    privateKey: "exit-protocol",
  },
  {
    id: "L5-07",
    cluePlaintext: "ESCAPEWINDOW",
    clueShift: 8,
    modCoefficient: 19,
    modulus: 26,
    message: "VERIFY FINAL SEAL",
    privateKey: "final-seal",
  },
  {
    id: "L5-08",
    cluePlaintext: "NODEUNLOCKED",
    clueShift: 6,
    modCoefficient: 21,
    modulus: 26,
    message: "RESTORE CORE LINK",
    privateKey: "core-link",
  },
  {
    id: "L5-09",
    cluePlaintext: "OVERRIDESET",
    clueShift: 9,
    modCoefficient: 23,
    modulus: 26,
    message: "OPEN SECURITY DOOR",
    privateKey: "security-door",
  },
  {
    id: "L5-10",
    cluePlaintext: "ESCAPEGRANTED",
    clueShift: 3,
    modCoefficient: 3,
    modulus: 26,
    message: "FINAL AUTH CHECK",
    privateKey: "final-auth",
  },
];

function pickRandomQuestion<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

export default function Level5Page() {
  useLevelGuard(5);
  const router = useRouter();
  const completeLevel = useGameStore((state) => state.completeLevel);
  const question = useMemo(() => pickRandomQuestion(QUESTIONS), []);
  const encryptedClue = useMemo(
    () => caesarEncrypt(question.cluePlaintext, question.clueShift),
    [question]
  );
  const [clueInput, setClueInput] = useState("");
  const [modInput, setModInput] = useState("");
  const [command, setCommand] = useState(question.message);
  const [sigStatus, setSigStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const expectedClue = question.cluePlaintext;
  const expectedMod = useMemo(
    () => modInverse(question.modCoefficient, question.modulus) ?? 0,
    [question]
  );
  const signature = useMemo(
    () => signMessage(question.message, question.privateKey),
    [question]
  );

  const clueSolved = clueInput.trim().toUpperCase() === expectedClue;
  const modSolved = Number(modInput) === expectedMod;
  const canEscape = clueSolved && modSolved && sigStatus === "valid";

  const handleVerify = () => {
    const isValid = verifySignature(command, signature, question.privateKey);
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
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Question {question.id}
        </p>
        <div className="rounded-md border border-border bg-black/60 px-4 py-5 text-center font-mono text-2xl text-accent">
          {encryptedClue}
        </div>
        <HintBox hint={`Shift = ${question.clueShift}.`} />
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
          {question.modCoefficient}x ≡ 1 (mod {question.modulus})
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
