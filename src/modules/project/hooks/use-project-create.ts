'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useCanvasStore } from '../../../shared/store/canvas-store';
import { useAuth } from '../../auth/queries/use-auth.query';
import { useShapesStore } from '../../canvas/hooks/shapes-store';
import { useHistoryStore } from '../../canvas/hooks/use-history-store';
import { ProjectService } from '../services/project.service';
import { useSelectedProjectId } from './use-current-project';
import { useExport } from './use-export';
import { useProjectPersistence } from './use-project-persistence';

export const PREVIEW_WIDTH = 300;
export const PREVIEW_HEIGHT = 300;
interface CanvasSettings {
  width: number;
  height: number;
  background: string;
  opacity: number;
  showGrid: boolean;
  gridGap: number;
}
export const useProjectCreate = (onSuccess?: () => void) => {
  const { saveProjectLocally, loadProjectFromAPI } = useProjectPersistence();
  const { getPngImage } = useExport();
  const { setId, clearId } = useSelectedProjectId();
  const me = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectName: string) => {
      // Set creating new project flag to prevent auto-saves
      const shapesStore = useShapesStore.getState();
      shapesStore.setCreatingNewProject(true);

      try {
        // FIRST: Clear localStorage to prevent auto-loading old project
        localStorage.removeItem('webster_current_project');

        // Clear current project ID
        clearId();

        // Get store instances
        const canvasStore = useCanvasStore.getState();
        const historyStore = useHistoryStore.getState();

        // Capture current canvas settings BEFORE clearing
        const currentCanvasSettings = {
          width: canvasStore.width,
          height: canvasStore.height,
          background: canvasStore.background,
          opacity: canvasStore.opacity,
          showGrid: canvasStore.showGrid,
          gridGap: canvasStore.gridGap
        };

        // Clear shapes and history but keep canvas settings
        shapesStore.clearShapes();
        shapesStore.setSelectedShapeIds([]);
        historyStore.clearHistory();

        // Set the new project name (don't reset canvas to defaults)
        canvasStore.setName(projectName);

        // Wait a bit for state to settle
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!me.isLoggedIn) {
          // For local projects, create a clean empty project with current settings
          createEmptyProject(projectName, currentCanvasSettings);
          await saveProjectLocally(projectName);
          return;
        }

        // For authenticated users, create project on server with empty state but current settings
        const emptyProjectData = createEmptyProject(projectName, currentCanvasSettings);

        const p = await ProjectService.create({
          name: projectName,
          canvas: JSON.stringify(emptyProjectData)
        });

        // Set the new project ID
        setId(p.id);

        // Generate preview for empty canvas
        const preview = await getPngImage(PREVIEW_WIDTH, PREVIEW_HEIGHT);
        if (preview) {
          await ProjectService.uploadPreview(p.id, preview);
        }

        // Load the newly created empty project
        await loadProjectFromAPI(emptyProjectData);
      } finally {
        // Reset the creating new project flag after a delay
        setTimeout(() => {
          shapesStore.setCreatingNewProject(false);
        }, 1000);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
      onSuccess?.();
    }
  });
};

// Helper function to create an empty project data structure with current canvas settings
const createEmptyProject = (projectName: string, canvasSettings: CanvasSettings) => {
  return {
    metadata: {
      name: projectName,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    canvas: {
      width: canvasSettings.width,
      height: canvasSettings.height,
      background: canvasSettings.background,
      opacity: canvasSettings.opacity,
      showGrid: canvasSettings.showGrid,
      gridGap: canvasSettings.gridGap,
      name: projectName,
      description: ''
    },
    shapes: [] // Always empty for new projects
  };
};
