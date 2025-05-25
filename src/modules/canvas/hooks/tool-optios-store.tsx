import { create } from 'zustand';

type PointerOptions = {
  pointerColor: string;
  pointerSize: number;
  showTrail: boolean;
  trailLength: number;
};

type BrushOptions = {
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  brushType: 'round' | 'square' | 'star';
  brushSpacing: number;
};

type ToolOptionsState = {
  pointer: PointerOptions;
  brush: BrushOptions;
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
  brush: {
    brushColor: '#000000',
    brushSize: 24,
    brushOpacity: 1,
    brushType: 'round',
    brushSpacing: 50
  },
  setToolOptions: (tool, opts) =>
    set((state) => {
      const current = state[tool];
      const isSame = Object.entries(opts).every(([key, value]) => current[key as keyof typeof current] === value);
      if (isSame) return state;
      return {
        [tool]: {
          ...current,
          ...opts
        }
      };
    })
}));
