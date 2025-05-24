import { UploadCloud } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { useSelectedProjectId } from '../../hooks/use-current-project';
import { useLocalProject } from '../../hooks/use-local-project';

export const UploadProject = () => {
  const { setCanvas, setName } = useLocalProject();
  const { setId } = useSelectedProjectId();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    setName(file.name.replace('.json', ''));
    setId(null); // Clear the current project ID to avoid conflicts
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        setCanvas(event.target?.result?.toString() || '');
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        toast.error('Invalid project file. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/json': ['.json']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative w-full flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed rounded-xl transition-colors duration-200 h-11/12
        ${
          isDragReject
            ? 'border-destructive/70 bg-red-200/20'
            : isDragActive
              ? 'border-primary bg-muted/40'
              : 'border-border hover:border-primary/40 hover:bg-muted/20'
        }`}>
      <input {...getInputProps()} />

      <UploadCloud className="w-10 h-10 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />

      <div className="text-center space-y-1">
        <h3 className="text-base font-medium">{isDragActive ? 'Release to upload' : 'Drag & Drop your file'}</h3>
        <p className="text-sm text-muted-foreground">or click to browse from your device</p>
      </div>
    </div>
  );
};
