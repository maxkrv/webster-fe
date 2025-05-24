import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { ProjectService } from '../services/project.service';

interface SelectedProjectIdState {
  id: string | null;
  setId: (id: string | null) => void;
}

const LOCAL_STORAGE_KEY = 'current-project-id';

export const useSelectedProjectId = create(
  persist<SelectedProjectIdState>(
    (set) => ({
      id: null,
      setId: (id) => set(() => ({ id }))
    }),
    {
      name: LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
export const useProject = (id: string | null) =>
  useQuery({
    queryKey: [QueryKeys.PROJECTS, id],
    queryFn: () => ProjectService.getOne(id!),
    enabled: !!id
  });

export const useCurrentProject = () => {
  const { id } = useSelectedProjectId();

  return useProject(id);
};
