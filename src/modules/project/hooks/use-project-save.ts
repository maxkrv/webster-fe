import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useAuth } from '../../auth/queries/use-auth.query';
import { ProjectService } from '../services/project.service';
import { useSelectedProjectId } from './use-current-project';
import { useExport } from './use-export';
import { useLocalProject } from './use-local-project';
import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from './use-project-create';

export const useProjectSave = (onSuccess?: () => void) => {
  const { name, setName, setCanvas } = useLocalProject();
  const { getJsonState, getPngImage } = useExport();
  const { id } = useSelectedProjectId();
  const me = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!me.isLoggedIn) {
        const jsonState = getJsonState();
        if (!jsonState) {
          throw new Error('Cant save. No canvas state found');
        }
        setName(name);
        setCanvas(jsonState);
        return;
      }
      const p = await ProjectService.update(id!, {
        name,
        canvas: getJsonState()
      });
      const preview = await getPngImage(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      if (!preview) return;
      await ProjectService.uploadPreview(p.id, preview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
      onSuccess?.();
    }
  });
};
