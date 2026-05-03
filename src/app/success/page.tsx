"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import { TOTAL_LEVELS } from "@/lib/levels";
import { useGameStore } from "@/store/useGameStore";

export default function SuccessPage() {
  const completedLevels = useGameStore((state) => state.completedLevels);
  const reset = useGameStore((state) => state.reset);

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-8 rounded-2xl border border-border bg-card p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.45)]"
      >
         <div className="space-y-4">
           <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
             Mission Complete
           </p>
           <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
             Escape Sequence Successful
           </h1>
           <p className="text-sm text-muted md:text-base">
             The system is stabilized and every lock has been cleared. Your
             cryptography instincts saved the network.
           </p>
         </div>
         <ProgressBar
           completedLevels={completedLevels}
           total={TOTAL_LEVELS}
           currentLevel={TOTAL_LEVELS}
         />
         <div className="flex flex-wrap justify-center gap-3">
           <Link href="/" className="btn-primary">
             Return to Hub
           </Link>
           <button type="button" className="btn-outline" onClick={reset}>
             Reset Run
           </button>
         </div>
       </motion.div>
     </main>
   );
 }
