import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MyProjectState {
  name: string;
  setName: (name: string) => void;
  canvas: string | null;
  setCanvas: (canvas: string | null) => void;
}

const LOCAL_STORAGE_KEY = 'current-project';

export const projectStore = createStore(
  persist<MyProjectState>(
    (set) => ({
      name: 'Unnamed Project',
      canvas: null,
      setCanvas: (canvas) => set(() => ({ canvas })),
      setName: (name) => set(() => ({ name }))
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useLocalProject = () => {
  return useStore(projectStore);
};
