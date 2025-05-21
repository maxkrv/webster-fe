import { useState } from 'react';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

import { mockProjects } from '../../../../../__mock__/projects';
import dayjs from '../../../../lib/dayjs';
import { Image } from '../../image';

export const RecentProjects = () => {
  const [query, setQuery] = useState('');

  return (
    <>
      <Input
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-2 gap-2">
        {mockProjects.map((project) => (
          <Button
            key={project.id}
            unstyled
            className="group cursor-pointer aspect-square rounded-lg border border-transparent p-2 hover:border-primary hover:shadow-md transition-all hover:bg-muted">
            <div className="aspect-video rounded-t-xl overflow-hidden">
              <Image alt="" wrapperClassName="size-full aspect-video" />
            </div>
            <div className="mt-1 grid gap-1 text-start">
              <h3 className="text-sm font-medium">{project.name}</h3>
              <p className="text-xs text-muted-foreground">{`Edited ${dayjs(project.updated).fromNow()}`}</p>
              <div
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'xs' }),
                  'w-full group-hover:bg-gradient-to-r from-primary to-secondary group-hover:text-primary-foreground'
                )}>
                Open
              </div>
            </div>
          </Button>
        ))}
      </div>
    </>
  );
};
