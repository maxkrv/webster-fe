import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { userGroupOptions } from '@/modules/auth/queries/use-auth.query';
import { AuthService } from '@/modules/auth/services/auth.service';
import { useTokens } from '@/modules/auth/stores/tokens.store';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';

import { SCHEME_OPTIONS } from '../../../shared/components/common/theme/color-palette-select';
import { UserAvatar } from '../../../shared/components/common/user-avatar';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../shared/components/ui/drawer';
import { cn } from '../../../shared/lib/utils';
import { useColorScheme } from '../../../shared/store/color-scheme.store';

export const UserMenuSheet = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5);

  // Profile form state
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [open, setOpen] = useState(false);
  // const { data: user } = useAuth();
  const tokens = useTokens();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: () => {
      return AuthService.logout(tokens.tokens?.refreshToken || '');
    },
    onSuccess: () => {
      tokens.deleteTokens();
      queryClient.resetQueries(userGroupOptions());
      navigate('/');
      toast.success('Logged out successfully');
      setOpen(false);
    }
  });
  //todo: uncomment and implement the following code
  // if (!user) return null;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full ring-offset-2" unstyled>
          <UserAvatar
            className="h-8 w-8"
            user={{
              name: 'John Doe',
              avatar: null
            }}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 overflow-hidden flex flex-col h-full">
        {/* Sticky Header with User Info */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40 shadow-sm">
          <DrawerHeader className="p-4 pb-2">
            <DrawerTitle className="text-primary">User Settings</DrawerTitle>
            <DrawerDescription>Manage your profile and preferences</DrawerDescription>
          </DrawerHeader>

          {/* User Profile Section - Sticky */}
          <div className="flex items-center gap-3 px-4 pb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white text-lg font-bold shadow-md">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-container thin-scrollbar hover-show-scrollbar">
          {/* Profile Edit Form */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2 text-foreground">Edit Profile</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm">
                  Full Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <Button className="w-full rounded-full bg-gradient-to-r from-gradient-start to-gradient-end text-white mt-2">
                Save Profile
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Auto-save Settings */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2 text-foreground">Auto-save Settings</h3>
            <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save" className="text-sm">
                    Auto-save Projects
                  </Label>
                  <p className="text-xs text-muted-foreground">Automatically save changes as you work</p>
                </div>
                <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              {autoSave && (
                <div className="space-y-1 pt-2 border-t border-border/30">
                  <Label htmlFor="auto-save-interval" className="text-sm">
                    Auto-save Interval
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="auto-save-interval"
                      type="number"
                      min="1"
                      max="60"
                      value={autoSaveInterval}
                      onChange={(e) => setAutoSaveInterval(Number.parseInt(e.target.value))}
                      className="rounded-lg"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">minutes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Color Palette Selection */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2 text-foreground">Color Palette</h3>

            <div className="flex flex-wrap gap-2">
              {SCHEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    'relative flex-1 min-w-[calc(33%-0.5rem)] aspect-square rounded-lg overflow-hidden transition-all',
                    colorScheme === option.value
                      ? 'ring-2 ring-primary shadow-md'
                      : 'ring-1 ring-border hover:ring-primary/50'
                  )}
                  onClick={() => setColorScheme(option.value)}
                  title={option.label}>
                  <div
                    className="absolute inset-0 bg-gradient-to-br"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${option.colors[0]}, ${option.colors[1]})`
                    }}
                  />

                  {colorScheme === option.value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1 text-xs font-medium text-center">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Select a color palette to customize the app&apos;s appearance
            </div>
          </div>
        </div>

        {/* Sticky Footer with Logout */}
        <div className="sticky bottom-0 mt-auto p-4 bg-background border-t border-border/40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <Button variant="outline" className="w-full" onClick={() => logout.mutate()}>
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
