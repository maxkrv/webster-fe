import { useQuery } from '@tanstack/react-query';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { Image } from '../../../../shared/components/common/image';
import { QueryKeys } from '../../../../shared/constants/query-keys';
import dayjs from '../../../../shared/lib/dayjs';
import { ProjectService } from '../../services/project.service';

export const RecentProjects = () => {
  const myProjects = useQuery({
    queryKey: [QueryKeys.PROJECTS],
    queryFn: () =>
      ProjectService.getMy({
        limit: 8,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      })
  });

  return (
    <div className="grid gap-2">
      {myProjects.data?.items.map((project) => (
        <Button
          key={project.id}
          unstyled
          className="flex items-center gap-3 p-1 rounded-lg hover:bg-muted/70 border border-transparent hover:border-primary/30 cursor-pointer transition-all group w-full">
          <Image alt="" wrapperClassName="size-12 rounded-md overflow-hidden border" src={project.previewUrl} />
          <div className="min-w-0 text-start">
            <h3 className="text-sm font-medium truncate">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              Edited on {dayjs(project.updatedAt).format('MMM D, YYYY HH:mm A')}
            </p>
          </div>
          <div
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'group-hover:bg-gradient-to-r from-primary to-secondary group-hover:text-primary-foreground ml-auto'
            )}>
            Open
          </div>
        </Button>
      ))}
    </div>
  );
};
