import { useShapesStore } from './shapes-store';
import { useCanvasHistory } from './use-canvas-history';

export const useCanvasReset = () => {
  const clearShapes = useShapesStore((state) => state.clearShapes);
  const { resetHistory } = useCanvasHistory();
  // Example usage of text and image stores, assuming they exist
  // const clearTexts = useTextStore((state) => state.clearTexts);
  // const clearImages = useImageStore((state) => state.clearImages);

  const resetCanvas = () => {
    clearShapes();
    resetHistory();
    // clearTexts();
    // clearImages();
  };

  return { resetCanvas };
};
