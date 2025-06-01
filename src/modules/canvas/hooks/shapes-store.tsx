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
  strokeColor?: string;
  strokeWidth?: number;
  showStroke?: boolean;
  shouldFill?: boolean;
  x2?: number;
  y2?: number;
  tool?: 'pen' | 'brush' | 'eraser';
  hardness?: number;
  // Add transform properties for selection
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
  // Image specific properties
  imageUrl?: string;
  imageElement?: HTMLImageElement;
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
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  clearShapes: () => void;
  setSelectedShapeIds: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  getSelectedShapes: () => Shape[];
  updateShape: (id: string, updates: Partial<Shape>) => void;
}

export const useShapesStore = create<ShapesState>((set, get) => ({
  shapes: [],
  selectedShapeIds: [],

  setShapes: (valueOrUpdater) =>
    set((state) => {
      const nextShapes =
        typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: Shape[]) => Shape[])(state.shapes)
          : valueOrUpdater;

      return { shapes: nextShapes };
    }),

  clearShapes: () => set({ shapes: [], selectedShapeIds: [] }),

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
    set((state) => ({
      shapes: state.shapes.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
    }))
}));
