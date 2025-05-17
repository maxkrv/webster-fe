import type React from 'react';
import { FC } from 'react';

import { Sidebar, SidebarProvider } from '../../../shared/components/ui/sidebar';
import { cn } from '../../../shared/lib/utils';
import { useLeftSidebarStore } from '../hooks/use-left-sidebar-store';
import { SidebarSheet } from './sidebar-sheet';
import { ToolBar } from './toolbar';

export const LeftSidebar: FC<React.ComponentProps<typeof Sidebar>> = ({ ...props }) => {
  const { showLeftSidebar, setShowLeftSidebar } = useLeftSidebarStore();

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '18rem' }}
      open={showLeftSidebar}
      onOpenChange={setShowLeftSidebar}
      className="w-auto flex h-full">
      <ToolBar />
      <Sidebar
        collapsible={'offcanvas'}
        {...props}
        className={cn('border-r ml-12 flex-shrink-0 z-0 max-h-screen-no-header mt-header', props.className)}>
        <SidebarSheet title="Left Sidebar" onClose={() => setShowLeftSidebar(false)}>
          {' '}
        </SidebarSheet>
      </Sidebar>
    </SidebarProvider>
  );
};
