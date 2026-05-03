"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";

export function useLevelGuard(level: number) {
  const router = useRouter();
  const completedLevels = useGameStore((state) => state.completedLevels);

  useEffect(() => {
    if (level <= 1) {
      return;
    }
    const required = Array.from({ length: level - 1 }, (_, index) => index + 1);
    const missing = required.find((req) => !completedLevels.includes(req));
    if (missing) {
      router.replace(`/level-${missing}`);
    }
  }, [completedLevels, level, router]);
}
