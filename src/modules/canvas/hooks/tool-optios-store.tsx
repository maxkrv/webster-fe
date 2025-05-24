import { create } from 'zustand';

type PointerOptions = {
  pointerColor: string;
  pointerSize: number;
  showTrail: boolean;
  trailLength: number;
};

type ToolOptionsState = {
  pointer: PointerOptions;
  // other tools can be added here
  setToolOptions: <K extends keyof ToolOptionsState>(tool: K, opts: Partial<ToolOptionsState[K]>) => void;
};

export const useToolOptionsStore = create<ToolOptionsState>((set) => ({
  pointer: {
    pointerColor: '#FF5555',
    pointerSize: 8,
    showTrail: true,
    trailLength: 50
  },
  setToolOptions: (tool, opts) =>
    set((state) => ({
      [tool]: {
        ...state[tool],
        ...opts
      }
    }))
}));
