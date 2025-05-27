import { create } from 'zustand';

export type Shapes = 'rectangle' | 'circle' | 'line' | 'hexagon' | 'star' | 'triangle';

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

type PenOptions = {
  penColor: string;
  penSize: number;
  penType: 'ballpoint' | 'fountain' | 'marker';
  smoothing: number;
};

type ShapeOptions = {
  shapeColor: string;
  shapeSize: number;
  shapeType: Shapes;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  showStroke: boolean;
  shouldFill: boolean;
};

type ToolOptionsState = {
  pointer: PointerOptions;
  brush: BrushOptions;
  pen: PenOptions;
  shape: ShapeOptions;
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
  pen: {
    penColor: '#000000',
    penSize: 2,
    penType: 'ballpoint',
    smoothing: 50
  },
  shape: {
    shapeColor: '#8B5CF6',
    shapeSize: 50,
    shapeType: 'rectangle',
    fillColor: '#8B5CF6',
    strokeColor: '#000000',
    strokeWidth: 2,
    showStroke: true,
    shouldFill: true
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
