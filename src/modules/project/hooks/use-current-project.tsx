import { create } from 'zustand';

interface CurrentProjectState {
  projectName: string;
  setProjectName: (name: string) => void;
}

export const useCurrentProject = create<CurrentProjectState>((set) => ({
  projectName: '',
  setProjectName: (name: string) => set({ projectName: name })
}));
