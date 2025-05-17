import { create } from 'zustand';

interface DimensionDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDimensionDialogStore = create<DimensionDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen })
}));
