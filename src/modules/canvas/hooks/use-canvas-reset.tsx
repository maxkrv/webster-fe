import { useShapesStore } from './shapes-store';

export const useCanvasReset = () => {
  const clearShapes = useShapesStore((state) => state.clearShapes);
  // Example usage of text and image stores, assuming they exist
  // const clearTexts = useTextStore((state) => state.clearTexts);
  // const clearImages = useImageStore((state) => state.clearImages);

  const resetCanvas = () => {
    clearShapes();
    // clearTexts();
    // clearImages();
  };

  return { resetCanvas };
};
