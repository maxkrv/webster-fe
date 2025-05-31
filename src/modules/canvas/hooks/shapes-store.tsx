import { create } from 'zustand';

export type Shape = {
  id: string;
  type: 'round' | 'square' | 'star' | 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'line' | 'polygon';
  x: number;
  y: number;
  size: number;
  color: string;
  points?: number[];
  opacity: number;
  penType?: 'ballpoint' | 'fountain' | 'marker';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showStroke?: boolean;
  shouldFill?: boolean;
  x2?: number;
  y2?: number;
  tool?: 'pen' | 'brush' | 'eraser';
  hardness?: number;
};

interface ShapesState {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  clearShapes: () => void;
}

export const useShapesStore = create<ShapesState>((set) => ({
  shapes: [],
  setShapes: (valueOrUpdater) =>
    set((state) => {
      const nextShapes =
        typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: Shape[]) => Shape[])(state.shapes)
          : valueOrUpdater;

      return { shapes: nextShapes };
    }),
  clearShapes: () => set({ shapes: [] })
}));
