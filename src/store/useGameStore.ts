import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const TOTAL_LEVELS = 5;

type GameState = {
  level: number;
  totalLevels: number;
  completedLevels: number[];
  completeLevel: (level: number) => void;
  reset: () => void;
};

const defaultState = {
  level: 1,
  totalLevels: TOTAL_LEVELS,
  completedLevels: [],
};

const storage = createJSONStorage(() =>
  typeof window === "undefined" ? undefined : localStorage
);

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...defaultState,
      completeLevel: (level) =>
        set((state) => {
          if (state.completedLevels.includes(level)) {
            return state;
          }
          const completedLevels = [...state.completedLevels, level].sort(
            (a, b) => a - b
          );
          const nextLevel = Math.min(level + 1, state.totalLevels);
          return {
            completedLevels,
            level: Math.max(state.level, nextLevel),
          };
        }),
      reset: () => set(defaultState),
    }),
    {
      name: "cipher-quest-progress",
      storage,
    }
  )
);
