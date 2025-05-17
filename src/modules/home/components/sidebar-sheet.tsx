import { X } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../../../shared/components/ui/button';
import { SidebarContent, SidebarHeader } from '../../../shared/components/ui/sidebar';

interface SidebarSheetProps {
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
}
export const SidebarSheet: FC<SidebarSheetProps> = ({ onClose, children, title }) => {
  return (
    <div className="p-2">
      <SidebarHeader className="border-none p-0">
        <div className="flex items-center justify-between ml-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant={'ghost'} size={'icon'} onClick={() => onClose()} aria-label="Close sidebar">
            <X className="size-5" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
    </div>
  );
};
