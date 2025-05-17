import { LogIn } from 'lucide-react';

import { useAuth } from '../../../../modules/auth/queries/use-auth.query';
import { UserMenuSheet } from '../../../../modules/user/pages/user-sheet';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Link } from '../link';
import { ColorSchemeSelect } from '../theme/color-palette-select';
import { ThemeToggle } from '../theme/theme-toggle';
import { HeaderActions } from './header-actions';
import { LogoSection } from './logo';

export const Header = () => {
  const user = useAuth();
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full max-h-header'
      )}>
      <div className={cn('flex items-center')}>
        <LogoSection />
        <div className="flex flex-1 items-center justify-between space-x-2 ml-auto p-3">
          <div className="w-full flex-1 md:w-auto">{/* Search or other elements could go here */}</div>
          <div className="flex items-center gap-2">
            <HeaderActions />
            <Separator orientation="vertical" className="min-h-7" />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <ColorSchemeSelect />
            </div>
            <Separator orientation="vertical" className="min-h-7 mr-1" />
            {user.isLoggedIn ? (
              <UserMenuSheet />
            ) : (
              <Link unstyled to={'/auth/login'} className={buttonVariants({ variant: 'outline', size: 'icon' })}>
                <LogIn />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
