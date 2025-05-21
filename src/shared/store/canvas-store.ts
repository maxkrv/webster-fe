import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CanvasState {
  width: number;
  height: number;
  maxSize: number;
  minSize: number;
  scale: number;
  background: string;
  name: string;
  description: string;
  shouldResetScale: boolean;
  opacity: number;
  showGrid: boolean;

  setDimensions: (width: number, height: number) => void;
  setBackground: (color: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  resetCanvas: () => void;
  resetScale: () => void;
  setScale: (scale: number) => void;
  setOpacity: (opacity: number) => void;
  setShowGrid: (value: boolean) => void;
}

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const MAX_SIZE = 10000;
const MIN_SIZE = 10;
const DEFAULT_BACKGROUND = '#FFFFFF';

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      maxSize: MAX_SIZE,
      minSize: MIN_SIZE,
      shouldResetScale: false,
      scale: 1,

      background: DEFAULT_BACKGROUND,
      name: 'Untitled Design',
      description: '',
      opacity: 1,
      showGrid: false,

      setDimensions: (width, height) => set({ width, height }),
      setBackground: (background) => set({ background }),
      setName: (name) => set({ name }),
      setDescription: (description) => set({ description }),
      setScale: (scale) => set({ scale }),
      resetScale: () => set({ shouldResetScale: !get().shouldResetScale }),
      setOpacity: (opacity) => set({ opacity }),
      setShowGrid: (value) => set({ showGrid: value }),
      resetCanvas: () =>
        set({
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          background: DEFAULT_BACKGROUND,
          name: 'Untitled Design',
          description: '',
          opacity: 1
        })
    }),
    {
      name: 'canvas-storage'
    }
  )
);
