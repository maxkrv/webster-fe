import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CanvasState {
  width: number;
  height: number;
  scale: number;
  background: string;
  name: string;
  description: string;
  shouldResetScale: boolean;

  setDimensions: (width: number, height: number) => void;
  setBackground: (color: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  resetCanvas: () => void;
  resetScale: () => void;
  setScale: (scale: number) => void;
}

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_BACKGROUND = '#FFFFFF';

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      shouldResetScale: false,
      scale: 1,

      background: DEFAULT_BACKGROUND,
      name: 'Untitled Design',
      description: '',

      setDimensions: (width, height) => set({ width, height }),
      setBackground: (background) => set({ background }),
      setName: (name) => set({ name }),
      setDescription: (description) => set({ description }),
      setScale: (scale) => set({ scale }),
      resetScale: () => set({ shouldResetScale: !get().shouldResetScale }),
      resetCanvas: () =>
        set({
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          background: DEFAULT_BACKGROUND,
          name: 'Untitled Design',
          description: ''
        })
    }),
    {
      name: 'canvas-storage'
    }
  )
);
