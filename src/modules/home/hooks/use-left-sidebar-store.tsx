import { create } from 'zustand';

type Tools = 'select' | 'brush' | 'pen' | 'eraser' | 'pointer' | 'text' | 'shapes' | 'image';
type Shapes = 'rectangle' | 'circle' | 'line' | 'hexagon' | 'star' | 'triangle';

interface LeftSidebarStore {
  activeTool: Tools;
  setActiveTool: (tool: Tools) => void;
  activeShape: Shapes;
  setActiveShape: (shape: Shapes) => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
}
export const useLeftSidebarStore = create<LeftSidebarStore>((set) => ({
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),
  activeShape: 'rectangle',
  setActiveShape: (shape) => set({ activeShape: shape }),
  showLeftSidebar: false,
  setShowLeftSidebar: (show) => set({ showLeftSidebar: show })
}));
