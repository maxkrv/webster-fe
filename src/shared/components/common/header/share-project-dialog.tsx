'use client';

import { Facebook, Instagram, Linkedin, Mail, MessageSquare, Send, Share2, Twitter } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

type SocialPlatform = {
  name: string;
  icon: ReactNode;
  iconColor: string;
  textColorClass: string;
  hoverBgClass: string;
  hoverBorderClass: string;
  iconBgClass: string;
  url: string;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: <Facebook className="h-6 w-6" />,
    iconColor: '#1877F2',
    textColorClass: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    hoverBgClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    hoverBorderClass: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/40',
    url: 'https://www.facebook.com/sharer/sharer.php?u=https://webster.app'
  },
  {
    name: 'Twitter',
    icon: <Twitter className="h-6 w-6" />,
    iconColor: '#1DA1F2',
    textColorClass: 'group-hover:text-blue-500 dark:group-hover:text-blue-400',
    hoverBgClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    hoverBorderClass: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/40',
    url: 'https://twitter.com/intent/tweet?text=Check%20out%20my%20artwork%20on%20Webster!&url=https://webster.app'
  },
  {
    name: 'Instagram',
    icon: <Instagram className="h-6 w-6" />,
    iconColor: '#E4405F',
    textColorClass: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
    hoverBgClass: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
    hoverBorderClass: 'hover:border-pink-300 dark:hover:border-pink-700',
    iconBgClass: 'bg-pink-100 dark:bg-pink-900/40',
    url: 'https://www.instagram.com/'
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="h-6 w-6" />,
    iconColor: '#0A66C2',
    textColorClass: 'group-hover:text-blue-700 dark:group-hover:text-blue-400',
    hoverBgClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    hoverBorderClass: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/40',
    url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://webster.app'
  }
];

const MESSAGING_PLATFORMS: SocialPlatform[] = [
  {
    name: 'Email',
    icon: <Mail className="h-6 w-6" />,
    iconColor: '#6B7280',
    textColorClass: 'group-hover:text-gray-700 dark:group-hover:text-gray-300',
    hoverBgClass: 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
    hoverBorderClass: 'hover:border-gray-300 dark:hover:border-gray-700',
    iconBgClass: 'bg-gray-100 dark:bg-gray-800/60',
    url: 'mailto:?subject=Check%20out%20my%20artwork%20on%20Webster&body=I%20created%20this%20on%20Webster:%20https://webster.app'
  },
  {
    name: 'WhatsApp',
    icon: <Send className="h-6 w-6 rotate-45" />,
    iconColor: '#25D366',
    textColorClass: 'group-hover:text-green-600 dark:group-hover:text-green-400',
    hoverBgClass: 'hover:bg-green-100 dark:hover:bg-green-900/30',
    hoverBorderClass: 'hover:border-green-300 dark:hover:border-green-700',
    iconBgClass: 'bg-green-100 dark:bg-green-900/40',
    url: 'https://api.whatsapp.com/send?text=Check%20out%20my%20artwork%20on%20Webster:%20https://webster.app'
  },
  {
    name: 'Telegram',
    icon: <Send className="h-6 w-6" />,
    iconColor: '#0088cc',
    textColorClass: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    hoverBgClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    hoverBorderClass: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/40',
    url: 'https://t.me/share/url?url=https://webster.app&text=Check%20out%20my%20artwork%20on%20Webster'
  },
  {
    name: 'Messenger',
    icon: <MessageSquare className="h-6 w-6" />,
    iconColor: '#0084ff',
    textColorClass: 'group-hover:text-blue-500 dark:group-hover:text-blue-400',
    hoverBgClass: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    hoverBorderClass: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/40',
    url: 'https://www.facebook.com/dialog/send?link=https://webster.app&app_id=291494419107518&redirect_uri=https://webster.app'
  }
];

interface PlatformButtonProps {
  platform: SocialPlatform;
  onClick: (platform: SocialPlatform) => void;
}

const PlatformButton = ({ platform, onClick }: PlatformButtonProps) => {
  return (
    <Button
      key={platform.name}
      variant="outline"
      className={cn(
        'group flex flex-col items-center justify-center h-24 p-2 rounded-xl transition-colors aspect-square',
        platform.hoverBgClass,
        platform.hoverBorderClass
      )}
      onClick={() => onClick(platform)}>
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-2', platform.iconBgClass)}>
        <span style={{ color: platform.iconColor }}>{platform.icon}</span>
      </div>
      <span className={cn('text-xs font-medium transition-colors', platform.textColorClass)}>{platform.name}</span>
    </Button>
  );
};

export const ShareProjectDialog = () => {
  const handleShare = (platform: SocialPlatform) => {
    // In a real implementation, this would handle the actual sharing
    window.open(platform.url, '_blank');
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Share canvas">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share canvas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Canvas</DialogTitle>
          <DialogDescription>Share your artwork with others</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Social Media</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SOCIAL_PLATFORMS.map((platform) => (
                <PlatformButton key={platform.name} platform={platform} onClick={handleShare} />
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Label className="text-base font-medium">Messaging</Label>
            <div className="grid grid-cols-4 gap-4">
              {MESSAGING_PLATFORMS.map((platform) => (
                <PlatformButton key={platform.name} platform={platform} onClick={handleShare} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
