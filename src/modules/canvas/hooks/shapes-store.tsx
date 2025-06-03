import type React from 'react';
import { create } from 'zustand';

export type Shape = {
  id: string;
  type:
    | 'round'
    | 'square'
    | 'star'
    | 'rectangle'
    | 'circle'
    | 'triangle'
    | 'hexagon'
    | 'line'
    | 'polygon'
    | 'text'
    | 'image';
  x: number;
  y: number;
  size: number;
  color: string;
  points?: number[];
  opacity: number;
  penType?: 'ballpoint' | 'fountain' | 'marker';
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  showStroke?: boolean;
  shouldFill?: boolean;
  x2?: number;
  y2?: number;
  tool?: 'pen' | 'brush' | 'eraser';
  hardness?: number;
  // Transform properties for selection
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  // Text specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'bold' | 'italic';
  align?: 'left' | 'center' | 'right';
  padding?: number;
  isEditing?: boolean;
  // Image specific properties - now only server URLs
  imageUrl?: string; // Server URL only
  imageElement?: HTMLImageElement; // Runtime only, not serialized
  originalWidth?: number;
  originalHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  flipX?: boolean;
  flipY?: boolean;
  cropActive?: boolean;
};

interface ShapesState {
  shapes: Shape[];
  selectedShapeIds: string[];
  isCreatingNewProject: boolean;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  clearShapes: () => void;
  setSelectedShapeIds: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  getSelectedShapes: () => Shape[];
  updateShape: (id: string, updates: Partial<Shape>) => void;
  saveShapesState: () => void;
  setCreatingNewProject: (creating: boolean) => void;
}

// Extend Window interface to include our custom property
interface WindowWithCanvasState extends Window {
  __CANVAS_STORE_STATE__?: {
    name: string;
    [key: string]: unknown;
  };
}

// We need to keep a reference to the save function outside the store
let saveProjectFunction: ((name: string) => Promise<void>) | null = null;

export const setSaveProjectFunction = (fn: (name: string) => Promise<void>) => {
  saveProjectFunction = fn;
};

export const useShapesStore = create<ShapesState>((set, get) => ({
  shapes: [],
  selectedShapeIds: [],
  isCreatingNewProject: false,

  setShapes: (valueOrUpdater) =>
    set((state) => {
      const nextShapes =
        typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: Shape[]) => Shape[])(state.shapes)
          : valueOrUpdater;

      // Don't auto-save if we're creating a new project
      if (!state.isCreatingNewProject) {
        // Schedule a save after shapes are updated
        setTimeout(() => {
          get().saveShapesState();
        }, 500);
      }

      return { shapes: nextShapes };
    }),

  clearShapes: () => {
    set({ shapes: [], selectedShapeIds: [] });
  },

  setSelectedShapeIds: (ids) => set({ selectedShapeIds: ids }),

  addToSelection: (id) =>
    set((state) => ({
      selectedShapeIds: state.selectedShapeIds.includes(id) ? state.selectedShapeIds : [...state.selectedShapeIds, id]
    })),

  removeFromSelection: (id) =>
    set((state) => ({
      selectedShapeIds: state.selectedShapeIds.filter((selectedId) => selectedId !== id)
    })),

  clearSelection: () => set({ selectedShapeIds: [] }),

  toggleSelection: (id) =>
    set((state) => ({
      selectedShapeIds: state.selectedShapeIds.includes(id)
        ? state.selectedShapeIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedShapeIds, id]
    })),

  getSelectedShapes: () => {
    const { shapes, selectedShapeIds } = get();
    return shapes.filter((shape) => selectedShapeIds.includes(shape.id));
  },

  updateShape: (id, updates) =>
    set((state) => {
      const updatedShapes = state.shapes.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape));

      // Don't auto-save if we're creating a new project
      if (!state.isCreatingNewProject) {
        // Auto-save when shapes are modified
        setTimeout(() => {
          get().saveShapesState();
        }, 500);
      }

      return { shapes: updatedShapes };
    }),

  setCreatingNewProject: (creating) => {
    set({ isCreatingNewProject: creating });
  },

  // Method to trigger save
  saveShapesState: () => {
    const state = get();

    // Don't save if we're creating a new project
    if (state.isCreatingNewProject) {
      return;
    }

    if (saveProjectFunction) {
      // Get the current canvas name from the canvas store directly
      const windowWithCanvas = window as WindowWithCanvasState;
      const canvasStore = windowWithCanvas.__CANVAS_STORE_STATE__ || null;
      let name = 'Untitled Design';

      // Try to get name from canvas store first
      if (canvasStore && canvasStore.name) {
        name = canvasStore.name;
      } else {
        // Fallback to localStorage
        const projectData = localStorage.getItem('webster_current_project');
        if (projectData) {
          try {
            const data = JSON.parse(projectData);
            name = data.metadata.name || data.canvas.name || name;
          } catch (e) {
            console.error('Failed to parse project data:', e);
          }
        }
      }
      saveProjectFunction(name).catch(console.error);
    }
  }
}));
