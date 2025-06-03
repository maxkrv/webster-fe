import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { setSaveProjectFunction } from './modules/canvas/hooks/shapes-store';
import { useProjectPersistence } from './modules/project/hooks/use-project-persistence';
import { Header } from './shared/components/common/header';
import { BoxBordersSwitch } from './shared/components/dev/box-borders-switch';
import { TailwindIndicator } from './shared/components/dev/tailwindIndicator';
import { Toaster } from './shared/components/ui/sonner';

export const App = () => {
  const { saveProjectLocally } = useProjectPersistence();

  useEffect(() => {
    setSaveProjectFunction(saveProjectLocally);
  }, [saveProjectLocally]);

  return (
    <>
      <Header />
      <Outlet />
      <TailwindIndicator />
      <BoxBordersSwitch />
      <Toaster expand />
    </>
  );
};
