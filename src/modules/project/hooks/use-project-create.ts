import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useAuth } from '../../auth/queries/use-auth.query';
import { ProjectService } from '../services/project.service';
import { useSelectedProjectId } from './use-current-project';
import { useExport } from './use-export';
import { useLocalProject } from './use-local-project';

export const PREVIEW_WIDTH = 300;
export const PREVIEW_HEIGHT = 300;

export const useProjectCreate = (onSuccess?: () => void) => {
  const { name, setName, setCanvas } = useLocalProject();
  const { getJsonState, getPngImage } = useExport();
  const { setId } = useSelectedProjectId();
  const me = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!me.isLoggedIn) {
        const jsonState = getJsonState();
        if (!jsonState) {
          throw new Error('Cant create. No canvas state found');
        }
        setName(name);
        setCanvas(jsonState);
        return;
      }
      const p = await ProjectService.create({
        name,
        canvas: getJsonState()
      });
      const preview = await getPngImage(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      if (!preview) return;
      await ProjectService.uploadPreview(p.id, preview);
      setId(p.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
      onSuccess?.();
    }
  });
};
